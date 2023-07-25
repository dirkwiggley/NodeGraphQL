import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { 
    GraphQLSchema, 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLList, 
    GraphQLInt, 
    GraphQLFloat,
    GraphQLNonNull } from 'graphql'
import getAppointments, { Appointment } from './appointments.js'
import getUsers, { User } from './users.js'
import { getDateString } from './appointments.js'

const app = express()

let users = getUsers();
let appointments = getAppointments();

const AppointmentType: any = new GraphQLObjectType({
    name: 'Appointment',
    description: 'This represents an appointment',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        userId: { type: GraphQLNonNull(GraphQLInt) },
        user: {
            type: UserType,
            resolve: (parent) => {
                return users.find(user => user.id === parent.userId)
            }
        },
        startTimestamp: { type: GraphQLNonNull(GraphQLFloat) },
        startTime: {
            type: GraphQLNonNull(GraphQLString),
            resolve: (appointment) => ( getDateString(appointment.startTimestamp) )
        },
        endTimestamp: { type: GraphQLNonNull(GraphQLFloat) },
        endTime: {
            type: GraphQLNonNull(GraphQLString),
            resolve: (appointment) => ( getDateString(appointment.endTimestamp) )
        },

    })
})

const ContactType: any = new GraphQLObjectType({
    name: 'ContactInfo',
    description: 'This represents user contact information',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        type: { type: GraphQLNonNull(GraphQLString) },
        data: { type: GraphQLNonNull(GraphQLString) },
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'This represents a user',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        firstName: { type: GraphQLNonNull(GraphQLString) },
        lastName: { type: GraphQLNonNull(GraphQLString) },
        fullName: {
            type: GraphQLNonNull(GraphQLString),
            resolve: (user) => (user.firstName + " " + user.lastName)
        },
        contactInfo: { type: GraphQLNonNull(GraphQLList(ContactType)) },
        appointments: {
            type: new GraphQLList(AppointmentType),
            resolve: (user) => (appointments.filter(appointment => appointment.userId === user.id))
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        appointment: {
            type: AppointmentType,
            description: 'A single appointment',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => (appointments.find(appointment => appointment.id === args.id))
        },
        appointments: {
            type: new GraphQLList(AppointmentType),
            description: 'Appointments',
            resolve: () => appointments
        },
        user: {
            type: UserType,
            description: 'A single user',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => (users.find(user => user.id === args.id))
        },
        users: {
            type: new GraphQLList(UserType),
            description: 'Users',
            resolve: () => users
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Mutation',
    fields: () => ({
        addUser: {
            type: UserType,
            description: 'Add a User',
            args: {
                firstName: { type: GraphQLNonNull(GraphQLString) },
                lastName: { type: GraphQLNonNull(GraphQLString) },
                contactInfo: { type: GraphQLString }
            },
            resolve: (parent, args) => {
                const user = new User(users.length + 1, args.firstName, args.lastName, args.contactInfo )
                users.push(user)
                return user
            }
        }, 
        removeUser: {
            type: UserType,
            description: 'Remove an User',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const user = { ...users.find(user => user.id === args.id) }
                users = users.filter(user => user.id !== args.id)
                // If you remove a user, remove their appointments as well
                appointments = appointments.filter(appointment => appointment.userId !== user.id)
                return user
            }
        },
        addAppointment: {
            type: AppointmentType,
            description: 'Add an Appointment',
            args: {
                userId: { type: GraphQLNonNull(GraphQLInt) },
                startTimestamp: { type: GraphQLNonNull(GraphQLFloat) },
                endTimestamp: { type: GraphQLNonNull(GraphQLFloat) },
            },
            resolve: (parent, args) => {
                const appointment = new Appointment(appointments.length + 1, args.userId, args.startTimestamp, args.endTimestamp)
                appointments.push(appointment)
                return appointment
            }
        },
        removeAppointment: {
            type: AppointmentType,
            description: 'Remove an Appointment',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const appointment = { ...appointments.find(appointment => appointment.id === args.id) }
                appointments = appointments.filter(appointment => appointment.id !== args.id)
                return appointment
            }
        },
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(8800, () => { console.log('Listening on port 8800') })
