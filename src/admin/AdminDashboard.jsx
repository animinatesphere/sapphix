import React from "react";
import { supabase } from "../../supabase";
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
};
const AdminDashboard = () => {
  return (
    <div className="flex">
      <p>AdminDashboard</p>
      <button onClick={signOut}>signout</button>
    </div>
  );
};

export default AdminDashboard;
