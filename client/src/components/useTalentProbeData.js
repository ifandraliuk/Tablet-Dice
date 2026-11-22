import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAttributes } from "../features/player/playerSlice";
import { getCategoryBoni } from "../features/inventory/inventorySlice";

export default function useTalentProbeData(user) {
  const dispatch = useDispatch();
  const attributes = useSelector((state) => state.player.attributes);
  const [boni, setBoni] = useState(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setBoni(null);
    setError("");
    Promise.all([
      dispatch(getAttributes()).unwrap(),
      dispatch(getCategoryBoni("talent")).unwrap(),
    ]).then(([attributeResult, result]) => {
      if (!attributeResult?.attributes || !Array.isArray(result?.boni) ||
          result.boni.some((item) => !item?.bonus?.type || !Number.isFinite(item.value))) {
        throw new Error("Die Probenwerte haben ein ungültiges Format.");
      }
      if (active) setBoni(result.boni);
    }).catch((failure) => {
      if (active) setError(typeof failure === "string" ? failure : failure?.message || "Bitte versuche es erneut.");
    });
    return () => { active = false; };
  }, [dispatch, user, reload]);

  return { attributes: boni ? attributes : null, boni, error, loading: !boni && !error, retry: () => setReload((value) => value + 1) };
}
