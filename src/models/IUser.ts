export interface User {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    dateOfBirth: Date;
    aptOrSuite: string;
    country: string;
    state: string;
    city: string;
    zipCode: string;
    phoneNumber: string;
    numberOfDependents: number;
    maritalStatus: MaritalStatus;
    employmentStatus: EmploymentStatus;
}