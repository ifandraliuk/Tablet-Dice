import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import playerService from "./playerService";
import { boniList } from "../../data/ConstVariables";
const user = JSON.parse(localStorage.getItem("user"));
console.log(user);
const vitality = JSON.parse(localStorage.getItem("vitality"));

const stamina = JSON.parse(localStorage.getItem("stamina"));
const mana = JSON.parse(localStorage.getItem("mana"));
const spirit = JSON.parse(localStorage.getItem("spirit"));
const loadCapacity = JSON.parse(localStorage.getItem("loadCapacity")); // strength * strength multiplier -> important for carying things
const equippedItems = JSON.parse(localStorage.getItem("equippedItems"));
const fraction = localStorage.getItem("fraction");
const slotsAllowed = JSON.parse(localStorage.getItem("slotsAllowed"));
const initialState = {
  player: [],
  level: 0,
  pointsLeft: 0,
  attributes: [],
  profession: {},
  bars: {
    vitality: vitality ? vitality : 0,
    stamina: stamina ? stamina : 0,
    mana: mana ? mana : 0,
    spirit: spirit ? spirit : 0,
  },
  playerDataLoaded: false,
  abilityCategory: "", // filter players abilities
  fractionTheme: fraction ? fraction : "", // main theme color based on his/her fraction
  equipped: equippedItems ? equippedItems : [], // equipped items
  armor: 0,
  bonis: [], // all active bonis
  setboni: "",
  weight: 0,
  loadCapacity: loadCapacity ? loadCapacity : 0,
  currPercentage: 0, // users weight in percent of his/her weight
  equipmentError: { variant: "", msg: "" },
  slotsAllowed: slotsAllowed ? slotsAllowed : [""], // 1 charisma - 1 slot, 5 CHA - 2 slots etc.
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Get player for logged in user
export const getPlayer = createAsyncThunk("player/get", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await playerService.getPlayer(token);
  } catch (error) {
    const msg =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.log(error.message);
    localStorage.clear();
    return thunkAPI.rejectWithValue(msg);
  }
});

// Get players profession
export const getProfession = createAsyncThunk("professions/get", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await playerService.getProfession(token);
  } catch (error) {
    const msg =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.log(error.message);
 
    return thunkAPI.rejectWithValue(msg);
  }
});


// Get player for logged in user
export const getAttributes = createAsyncThunk("attributes/get", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await playerService.getAttributes(token);
  } catch (error) {
    const msg =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.log(error.message);
 
    return thunkAPI.rejectWithValue(msg);
  }
});

// Get level
export const getLevel = createAsyncThunk("player/level/get", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await playerService.getLevel(token);
  } catch (error) {
    const msg =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.log(error.message);
    return thunkAPI.rejectWithValue(msg);
  }
});


// update level up
export const updateLevel = createAsyncThunk(
  "player/levelup/putAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      console.log(token);
      return await playerService.updateLevel(token);
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

// Posting a class to user
export const updateAttribute = createAsyncThunk(
  "attributes/putAll",
  async (attributeData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      console.log(token, attributeData);
      return await playerService.updateAttribute(attributeData, token);
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


// Posting a class to user
export const newBalance = createAsyncThunk(
  "player/balance/putAll",
  async (moneyData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await playerService.newBalance(moneyData, token);
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

export const toInventory = createAsyncThunk(
  "player/inventory/postAll",
  async (itemData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await playerService.toInventory(itemData, token);
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

export const updateInventory = createAsyncThunk(
  "player/inventory/putAll",
  async (inventoryData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await playerService.updateInventory(inventoryData, token);
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
export const deleteItem = createAsyncThunk(
  "player/inventory/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await playerService.deleteItem(id, token);
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

export const setEnchantment = createAsyncThunk(
  "player/enchantment/put",
  async (enchantmentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await playerService.setEnchantment(enchantmentData, token);
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

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    reset: (state) => initialState,
    resetLocalData: (state) => {
      state.fractionTheme = "";
      state.equipped = [];
    },
    loadPercentage: (state) => {
      state.currPercentage = state.weight / (state.loadCapacity / 100);
    },
    playerLoaded: (state, { payload }) => {
      //console.log("reducer: player data was loaded? ", payload)
      state.playerDataLoaded = payload.value;
      //console.log(state.playerDataLoaded)
    },
    increaseBar: (state, { payload }) => {
      const newValue = parseInt(state.bars[payload.category] + payload.value);
      if (newValue <= state.player?.attributes[payload.category] * 10) {
        localStorage.setItem(payload.category, newValue);
        state.bars[payload.category] = newValue;
        console.log(state.bars[payload.category], localStorage);
      }
    },
    equipItem: (state, { payload }) => {
      state.equipped = [
        {
          category: payload.category,
          equipment: payload.item,
        },
      ];
      localStorage.setItem("equippedItems", JSON.stringify(state.equipped));
    },
    unEquipItem: (state, { payload }) => {
      state.equipped = [
        {
          category: payload.category,
          equipment: "",
        },
      ];
      localStorage.setItem("equippedItems", JSON.stringify(state.equipped));
    },
    sortValueIncrease: (state) => {
      state.player?.talents.sort((a, b) => a.points - b.points);
    },
    sortValueDecreese: (state) => {
      state.player?.talents.sort((a, b) => b.points - a.points);
    },
    decreaseBar: (state, { payload }) => {
      const newValue = parseInt(state.bars[payload.category] - payload.value);
      if (
        newValue >= 0 &&
        newValue <= state.player?.attributes[payload.category] * 10
      ) {
        localStorage.setItem(payload.category, newValue);
        state.bars[payload.category] = newValue;
        console.log(state.bars[payload.category], localStorage);
      }
    },
    resetBars: (state) => {
      state.bars = {
        vitality: state.attributes?.vitality * 10,
        stamina: state.attributes?.stamina * 10,
        mana: state.attributes?.mana * 10,
        spirit: state.attributes?.spirit * 10,
      };
      localStorage.setItem("vitality", state.bars?.vitality);
      localStorage.setItem("stamina", state.bars.stamina);
      if (state.bars?.mana > 0) {
        localStorage.setItem("mana", state.bars?.mana);
      }
      if (state.bars?.spirit > 0) {
        console.log("reseting spirit");
        localStorage.setItem("spirit", state.bars?.spirit);
      }
    },
    getArmor: (state) => {
      let armor = 0;
      //console.log("get armor reducer")

      if (state.equipped && state.player.inventory) {
        state.equipped?.forEach((element) => {
          const item = state.player?.inventory.find(
            (el) => element.equipment === el._id
          )?.item;
          //console.log(item)
          if (item && item.category.toString() === "Rüstung") {
            armor += item.value;
          }
        });
        state.armor = armor;
      }
    },
    getBonis: (state) => {
      let bonis = [];
      let setnames = [];
      let counter = [];
      let flag = false;
      let setActive = "";
      //console.log("getting bonis")
      if (state.equipped && state.player.inventory) {
        state.equipped?.forEach((element) => {
          const el = state.player?.inventory.find(
            (el) => element.equipment === el._id
          );
          if (el?.item) {
            if (el.item.bonuses) {
              bonis.push(el.item.bonuses);
            }
            if (el.enchantment) {
              bonis.push(el.enchantment.bonuses);
            }
            if (el.item?.set) {
              if (setnames.includes(el.item?.set)) {
                //console.log("new component of the set found")
                const setId = setnames.findIndex(
                  (setname) => setname === el.item?.set
                );
                //console.log(setId)
                if (setId >= 0 && counter[setId]) {
                  counter[setId] = counter[setId] + 1;
                }
              } else {
                //console.log("found set: ", el.item.set)
                setnames.push(el.item.set);
                counter.push(1);
              }
              //console.log(setnames, counter)
            }
          }
        });
        //check if the set is completed - 6 items are equipped
        counter.forEach((count, i) => {
          if (count === 6) {
            //console.log("set is completed...activate setboni")
            flag = true;
            setActive = setnames[i];
          }
        });
        if (flag) {
          state.setboni = boniList[setActive];
        } else {
          state.setboni = "";
          setActive = "";
        }
        state.bonis = bonis;
      }
    },
    getWeight: (state) => {
      let newWeight = 0;
      if (state.player.inventory && state.player?.inventory?.length > 0) {
        state.player.inventory.forEach((el) => {
          //console.log(`${el.item.name}: ${el.item.weight} * ${el.amount} = ${el.item.weight * el.amount}`)
          newWeight = newWeight + el.item.weight * el.amount;
        });
        state.weight = Number(newWeight.toFixed(1));
        //console.log(Number((newWeight).toFixed(1)))
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlayer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPlayer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.playerDataLoaded = true;
        state.player = action.payload;
        console.log(localStorage, vitality);
        const v = JSON.parse(localStorage.getItem("vitality"));
        const st = JSON.parse(localStorage.getItem("stamina"));
        const m = JSON.parse(localStorage.getItem("mana"));
        const sp = JSON.parse(localStorage.getItem("spirit"));
        state.bars = {
          vitality: v > 0 ? v : state.player?.attributes.vitality * 10,
          stamina: st > 0 ? st : state.player?.attributes.stamina * 10,
          mana: m > 0 ? m : state.player?.attributes?.mana * 10,
          spirit: sp > 0 ? sp : state.player?.attributes?.spirit * 10,
        };
        const fraction = localStorage.getItem("fraction");
        state.fractionTheme = fraction ? fraction : "";
      })
      .addCase(getPlayer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.fractionTheme = fraction;
      })

      .addCase(getAttributes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAttributes.fulfilled, (state, action) => {
        const {attributes, pointsLeft} = action.payload
        state.isLoading = false;
        state.isSuccess = true;
        state.playerDataLoaded = true;
        state.attributes = attributes;
        state.pointsLeft = pointsLeft
      })
      .addCase(getAttributes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getProfession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profession = action.payload;
      })
      .addCase(getProfession.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })


      .addCase(getLevel.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLevel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.level = action.payload.level;
        state.pointsLeft = action.payload.pointsLeft;
      })
      .addCase(getLevel.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(updateLevel.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(updateLevel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.level = action.payload.level;
        state.pointsLeft = action.payload.pointsLeft;
      })
      .addCase(updateLevel.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(updateAttribute.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(updateAttribute.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.player.attributes[action.payload.attr] = action.payload.value;
      })
      .addCase(updateAttribute.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(newBalance.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(newBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.player.money = action.payload;
      })
      .addCase(newBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(setEnchantment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setEnchantment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.player.inventory = action.payload;
      })
      .addCase(setEnchantment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {
  reset,
  resetLocalData,
  loadPercentage,
  playerLoaded,
  sortedTalents,
  sortValueIncrease,
  sortValueDecreese,
  increaseBar,
  decreaseBar,
  resetBars,
  equipItem,
  unEquipItem,
  filterEquipment,
  getArmor,
  getBonis,
  getWeight,
} = playerSlice.actions;
export default playerSlice.reducer;
