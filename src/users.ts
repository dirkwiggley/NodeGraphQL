export interface ContactInfo {
    id: number
    type: string
    data: string
}

const CONTACT_TYPE = {
    TEXT: "text",
    MOBILE: "mobile",
    OFFICE: "office",
    HOME: "home"
}

export interface UserInterface {
    id: number
    firstName: string
    lastName: string
    contactInfo: Array<ContactInfo>
}

export class User implements UserInterface {
    public constructor(id: number, firstName: string, lastName: string, contactInfo: string) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.contactInfo = []
        try {
            const info = JSON.parse(contactInfo);
            if (Array.isArray(info)) {
                this.contactInfo = info
            } 
        } catch(error) {
            console.log(error)
        }
    }
    id: number
    firstName: string
    lastName: string
    contactInfo: Array<ContactInfo>

    getFullName = () => {
        return this.firstName + " " + this.lastName
    }
}

const getContactInfo = (id: number): ContactInfo => {
    switch (id) {
        case 1:
            return { id: 1, type: CONTACT_TYPE.MOBILE, data: "6508675309"};
        case 2:
            return { id: 2, type: CONTACT_TYPE.TEXT, data: "dbrown@gmail.com"};
        case 3:
            return { id: 3, type: CONTACT_TYPE.MOBILE, data: "5105551212"};
        case 4:
            return { id: 4, type: CONTACT_TYPE.MOBILE, data: "6508675309"};
        case 5:
            return { id: 5, type: CONTACT_TYPE.HOME, data: "5106661212"};
        case 6:
            return { id: 6, type: CONTACT_TYPE.OFFICE, data: "6502223333"};
        default:
            throw new Error("Invalid ID");
    }
}


const INITIAL_USERS = [
    new User(1, "Dan", "Brown", JSON.stringify([getContactInfo(1), getContactInfo(2)])),
    new User(2, "Lucy", "VanPelt", JSON.stringify([getContactInfo(3)])),
    new User(3, "Abraham", "Lincoln", JSON.stringify([getContactInfo(4)])),
    new User(4, "James", "Kirk", JSON.stringify([getContactInfo(5), getContactInfo(6)]))
]

const getUsers = () => {
    return [ ...INITIAL_USERS ]
}
export default getUsers