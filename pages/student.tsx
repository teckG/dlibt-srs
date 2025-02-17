import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StudentsDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    program: "",
    status: "Pending",
  });

  // Explicitly define the type of the event parameter
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Students Dashboard</h1>

      {/* Biographic Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="contact"
          placeholder="Contact Details"
          value={formData.contact}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="program"
          placeholder="Program Applied For"
          value={formData.program}
          onChange={handleChange}
          required
        />
        <Button type="submit">Save</Button>
      </form>

      {/* Progress Tracker */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Admission Status</h2>
        <p>{formData.status}</p>
      </div>
    </div>
  );
}