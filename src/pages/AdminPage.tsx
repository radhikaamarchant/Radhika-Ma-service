import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Upload,
  BadgeCheck,
  X,
  Building2,
  Bell,
  User,
  Info
} from "lucide-react";
import Cropper from "react-easy-crop";
import { useAppContext } from "../utils/AppContext";
import {
  getUnifiedBankBalance,
  getUnifiedTransactions,
} from "../utils/bankBalance";
import { formatINR } from "../utils/mockData";

interface AdminProfile {
  name: string;
  address: string;
  photoUrl: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branch?: string;
}

type AdminView = "menu" | "funds" | "profile" | "bank" | "statement";

export default function AdminPage() {
  const { state, dispatch } = useAppContext();
  const [profile, setProfile] = useState<AdminProfile>(() => {
    const saved = localStorage.getItem("adminProfile");
    return saved
      ? JSON.parse(saved)
      : { name: "Radhika Marchant", address: "", photoUrl: "" };
  });

  const [currentView, setCurrentView] = useState<AdminView>("menu");
  const [formData, setFormData] = useState(profile);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  useEffect(() => {
    if (state.loading) return;
    const adminBizId = "admin_business";
    const adminInvId = "admin_investor";
    if (state.businesses.find((b) => b.id === adminBizId)) {
      dispatch({ type: "DELETE_BUSINESS", payload: adminBizId });
    }
    if (state.investors.find((i) => i.id === adminInvId)) {
      dispatch({ type: "DELETE_INVESTOR", payload: adminInvId });
    }
  }, [state.loading, state.businesses.length, state.investors.length]);

  const handleSave = async () => {
    localStorage.setItem("adminProfile", JSON.stringify(formData));
    setProfile(formData);
    setCurrentView("menu");
    window.dispatchEvent(new Event("adminProfileUpdated"));
  };

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImageSrc(reader.result?.toString() || null),
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const createCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Scale down if too large
    // @ts-ignore
    const maxSize = 400;
    // @ts-ignore
    let targetWidth = croppedAreaPixels.width;
    // @ts-ignore
    let targetHeight = croppedAreaPixels.height;
    if (targetWidth > maxSize || targetHeight > maxSize) {
      const ratio = Math.min(maxSize / targetWidth, maxSize / targetHeight);
      targetWidth *= ratio;
      targetHeight *= ratio;
    }
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.drawImage(
      image,
      // @ts-ignore
      croppedAreaPixels.x,
      // @ts-ignore
      croppedAreaPixels.y,
      // @ts-ignore
      croppedAreaPixels.width,
      // @ts-ignore
      croppedAreaPixels.height,
      0,
      0,
      targetWidth,
      targetHeight,
    );
    const base64Image = canvas.toDataURL("image/jpeg", 0.7);
    
    // Save photo immediately
    const updatedProfile = { ...formData, photoUrl: base64Image };
    setFormData(updatedProfile);
    localStorage.setItem("adminProfile", JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
    window.dispatchEvent(new Event("adminProfileUpdated"));
    
    setImageSrc(null);
  };

  const unifiedBalance = getUnifiedBankBalance(
    profile.name,
    state.businesses,
    state.investors,
    state.investments,
    state.settings,
  );

  const bankTransactions = getUnifiedTransactions(
    profile.name,
    state.businesses,
    state.investors,
    state.investments,
    state.settings,
  );

  const calculateFees = () => {
    let regOwnerFees = 0;
    state.businesses.forEach(b => {
      if (b.id !== "admin_business") {
        regOwnerFees += (b.registrationCommissionPaid || 0) + (b.taxPaid || 0);
      }
    });

    let investorFees = 0;
    state.investors.forEach(i => {
      if (i.id !== "admin_investor") {
        investorFees += (i.rmasServiceCharge || 0);
      }
    });

    let authorities = 0;
    let investmentsCommission = 0;
    let brokerage = 0;
    let hpgTax = 0;

    state.investments.forEach(inv => {
      investmentsCommission += (inv.adminCommissionBusiness || 0) + (inv.adminCommissionInvestor || 0);
      if (inv.status === "completed" && inv.payoutDetails) {
        authorities += (inv.payoutDetails.rmasSubsidyPays || 0);
        brokerage += (inv.payoutDetails.rmasCommission || 0);
        hpgTax += (inv.payoutDetails.happyIncomeTax || 0);
      }
    });

    return {
      regOwnerFees,
      investorFees,
      authorities,
      investmentsCommission,
      brokerage,
      hpgTax
    };
  };

  const fees = calculateFees();

  return (
    <div className="bg-[#F8F9FA] md:bg-[#F8F9FA] min-h-full flex flex-col font-sans">
      <div className="w-full max-w-xl mx-auto flex-1 bg-[#F8F9FA] md:border-x md:border-gray-200">
        
        {currentView === "menu" && (
          <div className="animate-fade-in pb-10">
            <div className="px-5 pt-6 pb-2">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-[22px] md:text-[24px] font-medium text-[#444444]">
                  Account
                </h1>
                <Bell className="w-5 h-5 text-gray-500" />
              </div>
              <p className="text-[15px] md:text-[16px] text-[#444444] mb-2 tracking-wide flex items-center gap-1.5">
                {profile.name} <BadgeCheck className="w-[18px] h-[18px] text-[#1976D2]" />
              </p>
            </div>
            
            <div className="px-5 pb-6">
               <div className="bg-white rounded border border-gray-200 p-5 relative shadow-sm">
                  <div className="flex justify-between items-center">
                     <div>
                       <h2 className="text-[14px] md:text-[15px] font-normal text-[#444444] tracking-wider uppercase">RMAS OFFICIAL</h2>
                       <p className="text-[12px] md:text-[13px] text-[#9EA1A6] mt-1 tracking-wide">radhikaamarchant@gmail.com</p>
                     </div>
                     <div className="relative cursor-pointer shrink-0 ml-4" onClick={() => fileInputRef.current?.click()}>
                       <div className="w-[68px] h-[68px] md:w-[76px] md:h-[76px] rounded-full bg-[#E8F0FE] text-[#1976D2] flex items-center justify-center overflow-hidden relative">
                         {profile.photoUrl ? (
                           <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                         ) : (
                           <span className="text-[24px] font-normal">{profile.name.substring(0, 2).toUpperCase()}</span>
                         )}
                         <div className="absolute bottom-0 w-full h-1/3 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                           <Upload className="w-3 h-3 text-white" />
                         </div>
                       </div>
                     </div>
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </div>
               </div>
            </div>
            
            <div className="bg-white border-t border-gray-100 pt-2 pb-8">
               <div className="px-5 py-4 border-b border-gray-100">
                 <h3 className="text-[14px] md:text-[15px] font-medium text-[#444444]">Account</h3>
               </div>
               <div className="flex flex-col">
                 <button onClick={() => setCurrentView("funds")} className="flex items-center justify-between px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group w-full text-left">
                    <span className="text-[14px] md:text-[15px] font-normal text-[#444444]">Funds</span>
                    <span className="text-[16px] md:text-[18px] text-gray-400 font-serif mr-1">₹</span>
                 </button>
                 <button onClick={() => setCurrentView("profile")} className="flex items-center justify-between px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group w-full text-left">
                    <span className="text-[14px] md:text-[15px] font-normal text-[#444444]">Profile</span>
                    <User className="w-4 h-4 text-gray-400 mr-1" />
                 </button>
                 <button onClick={() => setCurrentView("bank")} className="flex items-center justify-between px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group w-full text-left">
                    <span className="text-[14px] md:text-[15px] font-normal text-[#444444]">Bank details</span>
                    <Building2 className="w-4 h-4 text-gray-400 mr-1" />
                 </button>
               </div>
            </div>
          </div>
        )}

        {currentView === "funds" && (
          <div className="bg-[#F8F9FA] min-h-full flex flex-col animate-fade-in relative -mx-0">
            <div className="bg-white flex items-center px-4 py-4 md:py-5 border-b border-gray-100 sticky top-0 z-10">
              <button onClick={() => setCurrentView("menu")} className="mr-4 text-[#444444] p-1">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-[18px] md:text-[20px] font-medium text-[#444444]">Funds</h1>
            </div>

            <div className="p-4 md:p-5 flex-1">
              <div className="bg-white rounded shadow-sm border border-gray-200 p-5 mb-6 text-center">
                <p className="text-[12px] md:text-[13px] text-[#9EA1A6] font-normal mb-2 flex items-center justify-center gap-1.5">
                  Available margin (Cash + Collateral) <Info className="w-3.5 h-3.5 text-[#1976D2]" />
                </p>
                <p className="text-[28px] md:text-[32px] font-medium text-[#1976D2] tracking-wide mb-4">
                  {unifiedBalance >= 0 ? "" : "-"}₹{formatINR(Math.abs(unifiedBalance)).replace("₹", "")}
                </p>
                <button 
                  onClick={() => setCurrentView("statement")}
                  className="flex items-center justify-center gap-1.5 text-[13px] md:text-[14px] text-[#1976D2] font-normal mx-auto"
                >
                  <span className="w-2.5 h-2.5 border-2 border-[#1976D2] rounded-full inline-block"></span>
                  View statement
                </button>
              </div>

              <div className="bg-white border-t border-gray-100 mt-2 pb-10">
                <div className="flex justify-between items-center py-3 md:py-4 px-4 border-b border-gray-50">
                  <span className="text-[13px] md:text-[14px] text-[#444444] font-normal">Opening balance</span>
                  <span className="text-[13px] md:text-[14px] text-[#444444] font-mono">30,00,00,000.00</span>
                </div>
                <div className="flex justify-between items-center py-3 md:py-4 px-4 border-b border-gray-50">
                  <span className="text-[13px] md:text-[14px] text-[#444444] font-normal">Reg owner fees</span>
                  <span className="text-[13px] md:text-[14px] text-[#444444] font-mono">{formatINR(fees.regOwnerFees).replace("₹", "")}</span>
                </div>
                <div className="flex justify-between items-center py-3 md:py-4 px-4 border-b border-gray-50">
                  <span className="text-[13px] md:text-[14px] text-[#444444] font-normal">Investor fees</span>
                  <span className="text-[13px] md:text-[14px] text-[#444444] font-mono">{formatINR(fees.investorFees).replace("₹", "")}</span>
                </div>
                <div className="flex justify-between items-center py-3 md:py-4 px-4 border-b border-gray-50">
                  <span className="text-[13px] md:text-[14px] text-[#444444] font-normal">Authorities</span>
                  <span className="text-[13px] md:text-[14px] text-[#444444] font-mono">{formatINR(fees.authorities).replace("₹", "")}</span>
                </div>
                <div className="flex justify-between items-center py-3 md:py-4 px-4 border-b border-gray-50">
                  <span className="text-[13px] md:text-[14px] text-[#444444] font-normal">Investments</span>
                  <span className="text-[13px] md:text-[14px] text-[#444444] font-mono">{formatINR(fees.investmentsCommission).replace("₹", "")}</span>
                </div>
                <div className="flex justify-between items-center py-3 md:py-4 px-4 border-b border-gray-50">
                  <span className="text-[13px] md:text-[14px] text-[#444444] font-normal">Brokerage</span>
                  <span className="text-[13px] md:text-[14px] text-[#444444] font-mono">{formatINR(fees.brokerage).replace("₹", "")}</span>
                </div>
                <div className="flex justify-between items-center py-3 md:py-4 px-4 border-b border-gray-50">
                  <span className="text-[13px] md:text-[14px] text-[#444444] font-normal">HPG Tax</span>
                  <span className="text-[13px] md:text-[14px] text-[#444444] font-mono">{formatINR(fees.hpgTax).replace("₹", "")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === "profile" && (
          <div className="bg-white flex-1 min-h-screen animate-fade-in relative pb-10">
            <div className="px-4 py-4 flex items-center border-b border-gray-100 sticky top-0 z-10 bg-white">
              <button onClick={() => { setCurrentView("menu"); setFormData(profile); }} className="mr-4 text-[#444444] p-1">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-[18px] md:text-[20px] font-medium text-[#444444]">Profile Details</h1>
            </div>
            
            <div className="p-5 md:p-6 space-y-6">
              <div>
                <label className="block text-[12px] md:text-[13px] font-medium uppercase tracking-wider text-[#9EA1A6] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full border-b border-gray-300 py-2 bg-transparent text-[14px] md:text-[15px] font-normal text-[#444444] focus:border-[#1976D2] outline-none transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[12px] md:text-[13px] font-medium uppercase tracking-wider text-[#9EA1A6] mb-1">
                  Office / Home Address
                </label>
                <textarea
                  className="w-full border-b border-gray-300 py-2 bg-transparent text-[14px] md:text-[15px] font-normal text-[#444444] focus:border-[#1976D2] outline-none transition-colors resize-none h-20"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              
              <div className="pt-4">
                <button onClick={handleSave} className="w-full bg-[#1976D2] text-white py-3 rounded font-normal text-[14px] md:text-[15px] hover:bg-blue-600 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === "bank" && (
          <div className="bg-white flex-1 min-h-screen animate-fade-in relative pb-10">
            <div className="px-4 py-4 flex items-center border-b border-gray-100 sticky top-0 z-10 bg-white">
              <button onClick={() => { setCurrentView("menu"); setFormData(profile); }} className="mr-4 text-[#444444] p-1">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-[18px] md:text-[20px] font-medium text-[#444444]">Bank details</h1>
            </div>
            
            <div className="p-5 md:p-6 space-y-6">
              <div>
                <label className="block text-[12px] md:text-[13px] font-medium uppercase tracking-wider text-[#9EA1A6] mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  className="w-full border-b border-gray-300 py-2 bg-transparent text-[14px] md:text-[15px] font-normal text-[#444444] focus:border-[#1976D2] outline-none transition-colors"
                  value={formData.bankName || ""}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[12px] md:text-[13px] font-medium uppercase tracking-wider text-[#9EA1A6] mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  className="w-full border-b border-gray-300 py-2 bg-transparent text-[14px] md:text-[15px] font-mono text-[#444444] focus:border-[#1976D2] outline-none transition-colors"
                  value={formData.accountNumber || ""}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[12px] md:text-[13px] font-medium uppercase tracking-wider text-[#9EA1A6] mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  className="w-full border-b border-gray-300 py-2 bg-transparent text-[14px] md:text-[15px] font-mono uppercase text-[#444444] focus:border-[#1976D2] outline-none transition-colors"
                  value={formData.ifscCode || ""}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                />
              </div>
              <div>
                <label className="block text-[12px] md:text-[13px] font-medium uppercase tracking-wider text-[#9EA1A6] mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  className="w-full border-b border-gray-300 py-2 bg-transparent text-[14px] md:text-[15px] font-normal text-[#444444] focus:border-[#1976D2] outline-none transition-colors"
                  value={formData.branch || ""}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                />
              </div>
              
              <div className="pt-4">
                <button onClick={handleSave} className="w-full bg-[#1976D2] text-white py-3 rounded font-normal text-[14px] md:text-[15px] hover:bg-blue-600 transition-colors">
                  Save Bank Details
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === "statement" && (
          <div className="bg-white flex-1 animate-fade-in relative pb-10 min-h-screen">
            <div className="px-4 py-4 flex items-center border-b border-gray-100 sticky top-0 z-10 bg-white">
              <button onClick={() => setCurrentView("funds")} className="mr-4 text-[#444444] p-1">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-[18px] md:text-[20px] font-medium text-[#444444]">Financial Statement</h1>
            </div>

            <div className="p-4 md:p-6">
              {bankTransactions.length > 0 ? (
                <div className="border border-gray-200 rounded overflow-hidden">
                  <table className="w-full text-left text-[13px] md:text-[14px]">
                    <thead className="bg-[#F8F9FA] border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4 font-normal text-[#9EA1A6] text-[12px] uppercase tracking-wider">Date</th>
                        <th className="py-3 px-4 font-normal text-[#9EA1A6] text-[12px] uppercase tracking-wider">Particulars</th>
                        <th className="py-3 px-4 text-right font-normal text-[#9EA1A6] text-[12px] uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bankTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-[12px] text-[#9EA1A6] whitespace-nowrap align-top">
                            {new Date(tx.date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-3 px-4 align-top">
                            <p className="text-[13px] md:text-[14px] font-medium text-[#444444]">{tx.title}</p>
                            <p className="text-[12px] text-[#9EA1A6] mt-0.5">{tx.description}</p>
                          </td>
                          <td className={`py-3 px-4 text-right font-mono text-[13px] md:text-[14px] align-top ${tx.type === "CREDIT" ? "text-green-600" : "text-[#444444]"}`}>
                            {tx.type === "CREDIT" ? "+" : "-"}
                            {formatINR(tx.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-[#9EA1A6] text-[13px] md:text-[14px] border border-gray-100 rounded bg-[#F8F9FA]">
                  No transactions recorded yet.
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Image Cropper Modal */}
      {imageSrc && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded w-full max-w-xl overflow-hidden flex flex-col h-[80vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-medium text-[15px] md:text-[16px] text-[#444444]">
                Crop Photo
              </h3>
              <button
                onClick={() => setImageSrc(null)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 relative bg-gray-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="p-5 md:p-6 bg-white border-t border-gray-100">
              <div className="mb-6 flex items-center space-x-4">
                <span className="text-[13px] md:text-[14px] font-medium text-gray-500">
                  Zoom
                </span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setImageSrc(null)}
                  className="px-5 py-2 text-[13px] md:text-[14px] font-normal text-gray-600 hover:bg-gray-50 border border-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={createCroppedImage}
                  className="px-5 py-2 text-[13px] md:text-[14px] font-normal text-white bg-[#1976D2] hover:bg-blue-600 rounded shadow-sm"
                >
                  Save Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
