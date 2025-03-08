import React from "react";
import { supabase } from "../../supabase";
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
};
const DashBoard = () => {
  return (
    <div className="con">
      <p>Dashboard</p>
      <button onClick={signOut}>sign out</button>
    </div>
  );
};

export default DashBoard;
