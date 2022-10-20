interface IRoutes<T>{
    route: `${T}${string}`,
    Component: JSX.Element
}

type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
type MaritalStatus = "Married" | "Single" 
type EmploymentStatus = "R" | "E" | "S" | "N";
// in @types/reach__router
declare function useLocation<T = {}>(): WindowLocation<T>;