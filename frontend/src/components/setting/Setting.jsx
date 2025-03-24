import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// import { updateSMTPSettings, getSMTPSettings } from "../../emailService.js";
import { toast } from "react-hot-toast";

const Settings = ({ userId }) => {
  // const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   // const fetchSettings = async () => {
  //   //   try {
  //   //     const data = await getSMTPSettings(userId);
  //   //     if (data.success) {
  //   //       Object.keys(data.smtp).forEach((key) => setValue(key, data.smtp[key]));
  //   //     }
  //   //   } catch (error) {
  //   //     console.error(error);
  //   //   }
  //   // };
  //   // fetchSettings();
  // }, );

  const onSubmit = async (data) => {
    // setLoading(true);
    // try {
    //   await updateSMTPSettings({ userId, ...data });
    //   toast.success("SMTP settings updated successfully!");
    // } catch (error) {
    //   toast.error(error.message || "Failed to update settings.");
    // }
    // setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">SMTP Settings</h2>
      {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("host")} placeholder="SMTP Host" className="input-field" required />
        <input {...register("port")} placeholder="SMTP Port" type="number" className="input-field" required />
        <input {...register("user")} placeholder="SMTP Email" type="email" className="input-field" required />
        <input {...register("pass")} placeholder="SMTP Password" type="password" className="input-field" required />
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form> */}
    </div>
  );
};

export default Settings;
