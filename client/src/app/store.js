import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/AuthSlice';
import playerReducer from '../features/player/playerSlice'
import talentReducer from '../features/talent/talentSlice'
import itemReducer from '../features/item/itemSlice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        player: playerReducer,
        talents: talentReducer,
        items: itemReducer,
    },
})