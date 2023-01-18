import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/AuthSlice';
import playerReducer from '../features/player/playerSlice'
import talentReducer from '../features/talent/talentSlice'
import itemReducer from '../features/item/itemSlice'
import creationReducer from '../features/creation/creationSlice';
import diaryReducer from '../features/diary/diarySlice';
import bestiariaReducer from '../features/bestiaria/bestiariaSlice';



export const store = configureStore({
    reducer: {
        creation: creationReducer,
        auth: authReducer,
        player: playerReducer,
        talents: talentReducer,
        items: itemReducer,
        diaries: diaryReducer,
        bestiaria: bestiariaReducer,
    },
})