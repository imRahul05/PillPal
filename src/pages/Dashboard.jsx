import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useMedications } from "@/hooks/useMedications";
import { useUserProfile } from "@/hooks/useUserProfile";
import MedicationForm from "@/components/MedicationForm";
import SideBar from "@/components/dashboard/SideBar";
import MainContent from "@/components/dashboard/MainContent";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);

  const {
    medications,
    loading: medsLoading,
    addMedication,
    markMedicationAsTaken,
    markMedicationAsMissed,
  } = useMedications();
  const { profile, loading: profileLoading } = useUserProfile();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate stats
  const activeMedications = medications.filter(
    (med) => med.status === "active"
  );
  const takenToday = activeMedications.filter((med) => med.taken).length;
  const missedToday = activeMedications.filter((med) => med.missed).length;
  const upcomingToday = activeMedications.length - takenToday - missedToday;

  // Medications that need renewal soon (within 30 days)
  const upcomingRenewals = activeMedications.filter((med) => {
    if (!med.renewalDate) return false;
    const renewalDate = new Date(med.renewalDate);
    const today = new Date();
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  });

  const handleAddMedication = async (data) => {
    // Format dates properly for storage
    const formattedData = {
      ...data,
      startDate: data.startDate
        ? data.startDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "",
      renewalDate: data.renewalDate
        ? data.renewalDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "",
      endDate: data.endDate
        ? data.endDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "",
      color: getColorForCategory(data.category),
      taken: false,
      missed: false,
    };

    await addMedication(formattedData);
    setIsAddMedicationOpen(false);
  };

  const getColorForCategory = (category) => {
    const colorMap = {
      "Blood Pressure": "bg-blue-500",
      Diabetes: "bg-green-500",
      Cholesterol: "bg-purple-500",
      "Blood Thinner": "bg-red-500",
      Thyroid: "bg-amber-500",
      "Pain Relief": "bg-pink-500",
      Antibiotic: "bg-cyan-500",
      "Acid Reflux": "bg-orange-500",
      Asthma: "bg-teal-500",
      "Mental Health": "bg-indigo-500",
      Allergy: "bg-yellow-500",
    };

    return colorMap[category] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-3 ">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <SideBar
              currentUser={currentUser}
              profile={profile}
              activeMedications={activeMedications}
              takenToday={takenToday}
              missedToday={missedToday}
              upcomingRenewals={upcomingRenewals}
            />

            {/* Main Content - Now taking full width by default */}
            <div className="lg:col-span-12">
              <MainContent
                activeMedications={activeMedications}
                takenToday={takenToday}
                medsLoading={medsLoading}
                markMedicationAsTaken={markMedicationAsTaken}
                markMedicationAsMissed={markMedicationAsMissed}
                setIsAddMedicationOpen={setIsAddMedicationOpen}
                navigate={navigate}
                upcomingRenewals={upcomingRenewals}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Add Medication Dialog */}
      <MedicationForm
        isOpen={isAddMedicationOpen}
        onClose={() => setIsAddMedicationOpen(false)}
        onSubmit={handleAddMedication}
        mode="add"
      />
    </div>
  );
};

export default Dashboard;