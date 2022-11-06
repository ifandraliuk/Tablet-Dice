import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/AuthSlice';
import playerReducer from '../features/player/playerSlice'
import talentReducer from '../features/talent/talentSlice'
import inventoryReducer from '../features/inventory/inventorySlice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        player: playerReducer,
        talents: talentReducer,
        inventory: inventoryReducer,
    },
})