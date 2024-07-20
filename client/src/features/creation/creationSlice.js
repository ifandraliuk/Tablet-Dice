import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import creationService from "./creationService";
const initialState = {
  partActive: "general",
  // General info
  generalInfo: {
    age: 0,
    kind: "Elb",
    haircolor: "",
    sex: "männlich",
    eyecolor: "",
    origin: "",
    haircut: "",
    more: "",
  },
  // Profession
  activeProfession: {},
  availableAbilities: [],
  activeAbility: "",
  professionList: [],
  specs: [],
  // Origin
  originList: [],
  activeOrigin: "",
  cuttedOrigin: "",
  
// Attributes
  attributes: {
    vitality: 0,strength: 0,
    dexterity: 0,
    intelligent: 0,
    
    stamina: 0,
    charisma: 0,
    mana: 0,
    spirit: 0,
  },
  totalPoints: 70,
  availablePoints: 70,
  // profile image
  userImage: null,
  // Readiness
  completionFlags: {
    general: false,
    origin: false,
    profession: false,
    attributes: false,
    complete: false,
  },
  dataFilled: false,
  imageUploaded: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// get list of all professions
export const getProfessions = createAsyncThunk(
  "professions/getAll",
  async (_, thunkAPI) => {
    try {
      return await creationService.getProfessions();
    } catch (error) {
      const msg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(msg);
    }
  }
);


export const uploadPicture = createAsyncThunk(
  "player/profilepic/post",
  async (pictureData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await creationService.uploadPicture(pictureData, token);
    } catch (error) {
      const msg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// Create new character
export const createCharacter = createAsyncThunk(
  "player/create/post",
  async (characterData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      return await creationService.createCharacter(characterData, token);
    } catch (error) {
      const msg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(error.message);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const creationSlice = createSlice({
  name: "creation",
  initialState,
  reducers: {
    resetCreation: (state)=> initialState,
    // set active category
    setActive: (state, { payload }) => {
      console.log(payload);
      state.partActive = payload;
    },
    setInfo: (state, { payload }) => {
      console.log(payload.name, payload.value);
      state.data[payload.name] = payload.value;
    },
    setUserImage: (state, payload)=>{
      state.userImage = payload.payload
    },
    setAttribute: (state, { payload }) => {
        const { id, value } = payload;
        const difference = value - state.attributes[id];
  
        if (state.availablePoints >= difference) {
          state.attributes[id] = value;
          state.availablePoints -= difference;
        } else {
          console.warn('Not enough points available');
        }
        if(state.availablePoints === 0 && state.attributes.vitality > 0){
          state.completionFlags.attributes = true
        } else state.completionFlags.attributes = false
    },
    resetAttributes: (state) => {
      state.attributes = initialState.attributes;
      state.availablePoints = initialState.totalPoints;
    },
    setGeneralInfo: (state, { payload }) => {
      console.log(payload);
      state.generalInfo[payload.name] = payload.value;
    },
    isGeneralComplete: (state) => {
      const { age, eyecolor, haircut, haircolor } = state.generalInfo;
      if (
        age > 0 &&
        eyecolor.length > 0 &&
        haircut.length > 0 &&
        haircolor.length > 0
      ) {
        state.completionFlags.general = true;
      } else state.completionFlags.general = false;
    },
    setActiveOrigin: (state, { payload }) => {
      console.log(payload);
      const fullOriginName = payload
      state.activeOrigin = fullOriginName;
      const splitted = fullOriginName.split(" ")
      const origin = splitted[splitted.length-1]
      console.log(origin)
      state.cuttedOrigin = origin
    },
    isOriginComplete: (state) => {
      
      if (state.activeOrigin.length>0) {
        state.completionFlags.origin = true;
      } else state.completionFlags.origin = false;
    },
    setActiveProfession: (state, payload) => {
      console.log(payload)
      //reset
      state.activeAbility = initialState.activeAbility
      state.availableAbilities = initialState.availableAbilities
      const specializationSet = new Set();
      state.activeProfession = payload.payload;
      state.activeProfession?.abilities?.forEach(ability => {
        specializationSet.add(ability.specialization);
      });
      const specializations = Array.from(specializationSet);
      state.specs = specializations
      const abilities = state.activeProfession.abilities
      console.log(abilities)
      if(state.activeProfession?.name === 'Magier'){
        const fireAbilities =  abilities.filter(el=>el.specialization==="Feuer")
        const iceAbilities =  abilities.filter(el=>el.specialization==="Eis")
        const lightningAbilities =  abilities.filter(el=>el.specialization==="Blitz")
        const arcaneAbilities =  abilities.filter(el=>el.specialization==="Arkan")
        const noviceAbilities = [fireAbilities[0], iceAbilities[0], 
        lightningAbilities[0], arcaneAbilities[0]]
        console.log(noviceAbilities)
        state.availableAbilities = noviceAbilities
      } else if(state.activeProfession?.name ==='Druide'){
        const noviceAbilities = abilities.filter(el=>el.specialization==="Natürliche Form")
        console.log(noviceAbilities)
        state.availableAbilities = noviceAbilities        
      }
      else{
        const noviceAbilities = abilities.filter(el=>el.specialization==="Novize")
        console.log(noviceAbilities)
        state.availableAbilities = noviceAbilities
      }
    },
    setActiveAbility: (state, payload)=>{
      state.activeAbility = payload.payload
    },
    isProfessionComplete: (state) => {
      if (state.activeProfession?.name?.length > 0 && state.activeAbility?.length>0) {
        state.completionFlags.profession = true;
      } else state.completionFlags.profession = false;
    },
    isComplete: (state)=>{
      const {general, origin, profession, attributes} = state.completionFlags
      if(attributes && general && origin && profession && attributes){
        state.completionFlags.complete = true
      } else state.completionFlags.complete = false
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(getProfessions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.professionList = action.payload;
      })
      .addCase(getProfessions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(uploadPicture.pending, (state) => {
        state.isLoading = true;
        state.isError = false
        state.isSuccess = false
      })
      .addCase(uploadPicture.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false
        state.imageUploaded = true;
      })
      .addCase(uploadPicture.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false
        state.message = action.payload;
        state.imageUploaded = false;
      })
      .addCase(createCharacter.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.isError = false;
        state.message = ""
        state.dataFilled = false;
      })
      .addCase(createCharacter.fulfilled, (state, action) => {
         state.isSuccess = true;
         state.isLoading = false;
         state.isError = false;
        state.dataFilled = true;
        state.message = "Charakterdaten wurden gespeichert"
       
       
        
      })
      .addCase(createCharacter.rejected, (state, action) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.isError = true;
        state.dataFilled = false;
        
        state.message = action.payload;
      });
  },
});

export const {
  resetCreation,
  setInfo,
  setUserImage,
  setGeneralInfo,
  isGeneralComplete,
  setActiveProfession,
  setActiveAbility,
  isProfessionComplete,
  setActiveOrigin,
  isOriginComplete,
  isComplete,
  setActive,
  setAttribute,
  resetAttributes,
  countTotal,
} = creationSlice.actions;
export default creationSlice.reducer;
