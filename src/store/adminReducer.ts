import appTypes from './types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import axios from 'axios';
import { BaseURL } from '../services/httpservice'
import { token } from '../services/webstorage';

export const initialState = {
    customerForm: {},
    stepperIndex: 0,
    formType: 1,
    userEmail: "",
    llcBeneficiaryValidate: false
};

export const addAction = (type: keyof typeof appTypes, payload: any) => ({
    type: type,
    payload,
});

export interface IAction {
    type: keyof typeof appTypes,
    payload: any
}

export const appReducer = (state = initialState, action: IAction): typeof initialState | undefined => {
    switch (action.type) {
        case 'SUBMIT_FORM':
            return {
                ...state,
                customerForm: action.payload
            }
        case 'STEPPER_INDEX':
            return {
                ...state,
                stepperIndex: action.payload
            }
        case 'FORM_TYPE':
            return {
                ...state,
                formType: action.payload
            }
        case 'LLC_BENEFICIARY_VALIDATE':
            return {
                ...state,
                llcBeneficiaryValidate: action.payload
            }
        default:
            return state
    }
};


export const getUserThunk = createAsyncThunk('users/get', async (user: any, thunkApi) => {

    try {
        const response = await axios.post(`${BaseURL}/admin/AllAccountsSignupDetails`, user, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token()}`
            },
        })

        return thunkApi.fulfillWithValue<{ result: [any], totalCount: number }>(response.data);
    } catch (error) {
        return thunkApi.rejectWithValue(error)
    }
})


export const getAdminUserThunk = createAsyncThunk('users/list', async (user: any, thunkApi) => {

    try {
        const response = await axios.get(`${BaseURL}/admin/Userslist`, {
            params:user,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token()}`
            },
        })

        return thunkApi.fulfillWithValue<{ result: [any], totalCount: number }>(response.data);
    } catch (error) {
        return thunkApi.rejectWithValue(error)
    }
})


// Define a type for the slice state
interface AdminState {
    userData: Array<any>,
    adminUser: Array<any>,
    adminUserCount: number,
    totalCount: number
}


// Define the initial state using that type
const initialAdminState: AdminState = {
    userData: [],
    totalCount: 0,
    adminUser: [],
    adminUserCount: 0
}

export const adminSlice = createSlice({
    name: 'admin',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState: initialAdminState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
    },
    extraReducers: (builder) => {
        builder.addCase(getUserThunk.pending, (state, action) => {

        })
        builder.addCase(getUserThunk.fulfilled, (state, action) => {
            // @ts-ignore
            state.userData = action.payload.result;
            // @ts-ignore
            state.totalCount = action.payload.totalCount;
        })
        builder.addCase(getUserThunk.rejected, (state, action) => {

        })

        builder.addCase(getAdminUserThunk.pending, (state, action) => {

        })
        builder.addCase(getAdminUserThunk.fulfilled, (state, action) => {
            // @ts-ignore
            state.adminUser = action.payload.result;
            // @ts-ignore
            state.adminUserCount = action.payload.totalCount;
        })
        builder.addCase(getAdminUserThunk.rejected, (state, action) => {

        })

    }
})

export const { reducer: adminReducer } = adminSlice
