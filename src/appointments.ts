export interface AppointmentInterface {
    id: number
    userId: number
    startTimestamp: number
    endTimestamp: number
}

export class Appointment implements AppointmentInterface {
    public constructor(id: number, userId: number, startTimestamp: number, endTimestamp: number) {
        this.id = id
        this.userId = userId
        this.startTimestamp = startTimestamp
        this.endTimestamp = endTimestamp
    }
    id: number
    userId: number
    startTimestamp: number
    endTimestamp: number
}

export const APPOINTMENTS = [
    new Appointment(1, 1, new Date(2023,6,1,10,0,0,0).getTime(), new Date(2023,6,1,10,30,0,0).getTime()),
    new Appointment(2, 2, new Date(2023,6,1,11,15,0,0).getTime(), new Date(2023,6,1,11,30,0,0).getTime()),
    new Appointment(3, 3, new Date(2023,6,1,13,0,0,0).getTime(), new Date(2023,6,1,14,0,0,0).getTime()),
    new Appointment(4, 4, new Date(2023,6,1,14,0,0,0).getTime(), new Date(2023,6,1,15,0,0,0).getTime()),
]

export const getDateString = (date: number): string => {
    const dateObj = new Date(date)
    return dateObj.toString()
}

const getAppointments = () => {
    return [ ...APPOINTMENTS ]
}
export default getAppointments

