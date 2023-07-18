export interface UserInterface {
    id: number
    firstName: string
    lastName: string
}

export class User implements UserInterface {
    public constructor(id: number, firstName: string, lastName: string) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
    }
    id: number
    firstName: string
    lastName: string

    getFullName = () => {
        return this.firstName + " " + this.lastName
    }
}

const INITIAL_USERS = [
    new User(1, "Dan", "Brown"),
    new User(2, "Lucy", "VanPelt"),
    new User(3, "Abraham", "Lincoln"),
    new User(4, "James", "Kirk")
]

const getUsers = () => {
    return [ ...INITIAL_USERS ]
}
export default getUsers