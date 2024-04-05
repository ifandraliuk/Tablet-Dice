import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/AuthSlice';
import playerReducer from '../features/player/playerSlice'
import companionReducer from '../features/companion/companionSlice';
import talentReducer from '../features/talent/talentSlice'
import itemReducer from '../features/item/itemSlice'
import creationReducer from '../features/creation/creationSlice';
import diaryReducer from '../features/diary/diarySlice';
import bestiariaReducer from '../features/bestiaria/bestiariaSlice';
import habitatReducer from '../features/habitats/habitatSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import atlasReducer from '../features/atlas/atlasSlice';

export const store = configureStore({
    reducer: {
        creation: creationReducer,
        inventory: inventoryReducer,
        auth: authReducer,
        player: playerReducer,
        companion: companionReducer,
        talents: talentReducer,
        items: itemReducer,
        diaries: diaryReducer,
        bestiaria: bestiariaReducer,
        habitat: habitatReducer,
        atlas: atlasReducer
    },
})