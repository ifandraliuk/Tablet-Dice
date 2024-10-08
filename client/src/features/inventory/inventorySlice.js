import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import inventoryService from "./inventoryService";

const initialState = {
  inventory: [],
  mainWeapon: null,
  secondWeapon: null,
  armor: 0,
  armorCategory: '', // 1 - light armor, 2 - medium, 3 - chain armor, 4 - plate armor
  money: [],
  capacity: 0,
  totalWeight: 0,
  // different type bonis for display
  activeBonis: [],
  armorBoni: [],
  customValuesBoni: [], // vitality, weight, stamina, mana
  talentBoni: [],
  attributeBoni: [],
  setBoni: [], // immunity and set boni

  extendedItemInfo: {},
  extendedId: "",
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};
// get users inventory
export const getInventory = createAsyncThunk(
  "inventory/get",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inventoryService.getInventory(token);
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

// get users armor and armor category
export const getArmor = createAsyncThunk(
  "inventory/armor/get",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inventoryService.getArmor(token);
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


// get users inventory
export const getLoadCapacity = createAsyncThunk(
  "inventory/capacity/get",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inventoryService.getLoadCapacity(token);
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

// get boni in the category
export const getCategoryBoni = createAsyncThunk(
  "bonus/get",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inventoryService.getCategoryBoni(data, token);
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

export const getUserWeapons = createAsyncThunk(
  "inventory/weapons/get",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inventoryService.getUserWeapons(token);
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
export const getUserMoney = createAsyncThunk(
  "inventory/money/get",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inventoryService.getUserMoney(token);
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
export const updateMoney = createAsyncThunk(
  "inventory/money/putAll",
  async (moneyData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inventoryService.updateMoney(moneyData, token);
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

export const addAmount = createAsyncThunk(
  "inventory/add-one/put",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inventoryService.addAmount(data, token);
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
export const substractAmount = createAsyncThunk(
  "inventory/substract-one/put",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inventoryService.substractAmount(data, token);
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

export const addToInventory = createAsyncThunk(
  "inventory/post",
  async (itemData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inventoryService.addToInventory(itemData, token);
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

export const removeFromInventory = createAsyncThunk(
  "inventory/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inventoryService.removeFromInventory(id, token);
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

export const splitAmount = createAsyncThunk(
  "inventory/split/put",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inventoryService.splitAmount(data, token);
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

export const shareWith = createAsyncThunk(
  "inventory/share/put",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inventoryService.shareWith(data, token);
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

export const equip = createAsyncThunk(
  "inventory/equip/put",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inventoryService.equip(data, token);
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

export const unequip = createAsyncThunk(
  "inventory/unequip/put",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inventoryService.unequip(data, token);
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

export const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    reset: (state) => initialState,
    extendInfo: (state, { payload }) => {
      state.extendedId = payload.id;
    },
    updateTotalWeight: (state) => {
      state.totalWeight = state.inventory.reduce((sum, item) => {
        // Check if the item has `item.weight` or `item.item.weight`
        const weight = item.weight ?? item.item?.weight ?? 0;
        return sum + weight;
      }, 0);
      //state.currPercentage = state.totalWeight / (state.loadCapacity / 100);
    },
    updateEquipmentStats: (state) => {
      if (state.inventory) {
        const equipped = state.inventory.filter(
          (el) => el.status === "Ausgerüstet"
        );
        const armor = equipped.reduce((sum, item) => sum + item.item.value, 0);
        console.log(armor);
        state.armor = armor;
        equipped.forEach(
          (el) => el.item.bonuses && state.activeBonis.push(el.item.bonuses)
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //get Inventory
      .addCase(getInventory.pending, (state) => {
        state.isLoading = true;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getInventory.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
        console.log(action.payload);
        state.inventory = data;
      })
      .addCase(getInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //get Armor
      .addCase(getArmor.pending, (state) => {
        state.isLoading = true;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getArmor.fulfilled, (state, action) => {
        const { armor, armorCategory } = action.payload;
        state.isLoading = false;
        state.isSuccess = true;

          state.armor = armor
          state.armorCategory = armorCategory === 1 ? 'leicht' 
          : armorCategory === 2 ? 'mittel' : armorCategory === 3 ? "schwer (Kette)" :
          armorCategory === 3 ? "schwer (Platte)" : "unbekannt"
        
      })
      .addCase(getArmor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // get user capacity incl companions capacity
      .addCase(getLoadCapacity.pending, (state) => {
        state.isLoading = true;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getLoadCapacity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.capacity = action.payload;
      })
      .addCase(getLoadCapacity.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // get all bonis in 1 category
      .addCase(getCategoryBoni.pending, (state) => {
        state.isLoading = true;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getCategoryBoni.fulfilled, (state, action) => {
        const { boni, category } = action.payload;
        console.log(boni, category);
        if (category === "talent") {
          return {
            ...state,
            talentBoni: boni,
          };
        } else if (category === "resistance") {
          return {
            ...state,
            armorBoni: boni,
          };
        }
        state.isLoading = false;
        state.isSuccess = true;
        console.log(action.payload);
      })
      .addCase(getCategoryBoni.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getUserWeapons.pending, (state) => {
        state.isLoading = true;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getUserWeapons.fulfilled, (state, action) => {
        const { mainWeapon, secondWeapon } = action.payload;
        state.mainWeapon = mainWeapon;
        state.secondWeapon = secondWeapon;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(getUserWeapons.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserMoney.pending, (state) => {
        state.isLoading = true;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getUserMoney.fulfilled, (state, action) => {
        state.money = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(getUserMoney.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateMoney.pending, (state) => {
        state.isLoading = true;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(updateMoney.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.money = action.payload
      })
      .addCase(updateMoney.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //add + 1
      .addCase(addAmount.pending, (state) => {
        state.isLoading = true;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(addAmount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.inventory = state.inventory.map((el) =>
          el._id.toString() === action.payload._id.toString()
            ? action.payload
            : el
        );
      })
      .addCase(addAmount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //- 1
      .addCase(substractAmount.pending, (state) => {
        state.isLoading = true;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(substractAmount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.inventory = state.inventory.map((el) =>
          el._id.toString() === action.payload._id.toString()
            ? action.payload
            : el
        );
      })
      .addCase(substractAmount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //add to Inventory
      .addCase(addToInventory.pending, (state) => {
        state.isLoading = true;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(addToInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.inventory = [...state.inventory, action.payload.data];
      })
      .addCase(addToInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })
      //remove from Inventory
      .addCase(removeFromInventory.pending, (state) => {
        state.isLoading = true;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(removeFromInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.inventory = state.inventory.filter(
          (item) => item._id.toString() !== action.payload.toString()
        );
      })
      .addCase(removeFromInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })
      //split amount
      .addCase(splitAmount.pending, (state) => {
        state.isLoading = true;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(splitAmount.fulfilled, (state, action) => {
        const { updatedItem, newItem } = action.payload;

        // Find the index of the existing item in the array
        const existingItemIndex = state.inventory.findIndex(
          (el) => el._id.toString() === updatedItem._id.toString()
        );

        // If the existing item is found, update it, otherwise, do nothing
        if (existingItemIndex !== -1) {
          // Create a new array with the updated item
          state.inventory = [
            ...state.inventory.slice(0, existingItemIndex),
            updatedItem,
            ...state.inventory.slice(existingItemIndex + 1),
          ];
        }

        // Create a new array with the new item added
        state.inventory = [...state.inventory, newItem];
      })
      .addCase(splitAmount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })
      //give item to the ther user
      .addCase(shareWith.pending, (state) => {
        state.isLoading = true;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(shareWith.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log(action.payload);
        state.inventory = state.inventory.filter(
          (item) => item._id.toString() !== action.payload.toString()
        );
      })
      .addCase(shareWith.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })
      //equip item to the user
      .addCase(equip.pending, (state) => {
        state.isLoading = true;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(equip.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const { replaced, unequipItem, additionalUnequip, updated } =
          action.payload;

        const updateItemInInventory = (item) => {
          const id = state.inventory.findIndex(
            (invItem) => invItem._id === item._id
          );
          console.log(`${item.type} id `, id);

          if (id !== -1) {
            // Replace the item at the found index with the new item
            state.inventory = [
              ...state.inventory.slice(0, id),
              item,
              ...state.inventory.slice(id + 1),
            ];
          }
        };

        if (updated) {
          updateItemInInventory(updated);
        }
        if (unequipItem) {
          updateItemInInventory(unequipItem);
        }
        if (additionalUnequip) {
          updateItemInInventory(additionalUnequip);
        }
      })
      .addCase(equip.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })
      //unequip
      //equip item to the user
      .addCase(unequip.pending, (state) => {
        state.isLoading = true;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(unequip.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const { id, uname } = action.payload;

        const i = state.inventory.findIndex(
          (invItem) => invItem._id.toString() === id.toString()
        );
        let item = state.inventory[i];
        item.status = uname;
        if (i !== -1) {
          // Replace the item at the found index with the new item
          state.inventory = [
            ...state.inventory.slice(0, i),
            item,
            ...state.inventory.slice(i + 1),
          ];
        }
      })
      .addCase(unequip.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      });
  },
});
export const { reset, extendInfo, updateEquipmentStats, updateTotalWeight } =
  inventorySlice.actions;
export default inventorySlice.reducer;
