import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../utils/AppContext";
import { formatINR } from "../utils/mockData";
import {
  ArrowLeft,
  Upload,
  ChevronRight,
  Info
} from "lucide-react";
import { Business } from "../types";
import { getVerificationStats } from "../utils/blueTick";
import {
  getUnifiedBankBalance,
  getUnifiedTransactions,
} from "../utils/bankBalance";
import ImageCropModal from "./ImageCropModal";

interface Props {
  businessId: string;
  onBack: () => void;
  onDelete?: () => void;
}

export default function BusinessDetail({
  businessId,
  onBack,
  onDelete,
}: Props) {
  const { state, dispatch } = useAppContext();
  const business = state.businesses.find((b) => b.id === businessId);
  const [currentView, setCurrentView] = useState<"menu" | "funds" | "profile" | "investors" | "bank" | "registration">("menu");
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fundingRequired: business?.fundingRequired.toString() || "0",
    interestRate: business?.interestRate.toString() || "0",
    status: business?.status || "listed",
    name: business?.name || "",
    description: business?.description || "",
    location: business?.location || "",
    photoUrl: business?.photoUrl || "",
  });

  useEffect(() => {
    if (business) {
      setFormData({
        fundingRequired: (business.fundingRequired || 0).toString(),
        interestRate: (business.interestRate || 0).toString(),
        status: business.status || "listed",
        name: business.name || "",
        description: business.description || "",
        location: business.location || "",
        photoUrl: business.photoUrl || "",
      });
    }
  }, [business]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!business) return null;

  const getTime = (id: string) => parseInt(id.replace(/\D/g, "")) || 0;
  const businessInvestments = state.investments
    .filter((inv) => inv.businessId === businessId)
    .sort((a, b) => getTime(b.id) - getTime(a.id));
  const activeBusinessInvestments = businessInvestments.filter(
    (i) => i.status !== "completed",
  );
  
  const totalFunded = activeBusinessInvestments.reduce(
    (sum, inv) => sum + inv.amount,
    0,
  );
  
  const payin = state.investments
    .filter(i => i.businessId === businessId)
    .reduce((sum, i) => sum + i.amount, 0);
  
  const payout = state.investments
    .filter(i => i.businessId === businessId && i.status === "completed")
    .reduce((sum, i) => sum + (i.amount + (i.amount * business.interestRate / 100)), 0);

  const bankTransactions = getUnifiedTransactions(
    business.ownerName,
    state.businesses,
    state.investors,
    state.investments,
    state.settings,
  );
  const authoritiesAssistance = bankTransactions
    .filter(tx => tx.category === "sahay")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const unifiedBalance = getUnifiedBankBalance(
    business.ownerName,
    state.businesses,
    state.investors,
    state.investments,
    state.settings,
  );

  const handleSaveProfile = () => {
    dispatch({
      type: "UPDATE_BUSINESS",
      payload: {
        ...business,
        name: formData.name,
        description: formData.description,
        location: formData.location,
        photoUrl: formData.photoUrl,
      },
    });
    setCurrentView("menu");
  };

  const handleSaveFunds = () => {
    dispatch({
      type: "UPDATE_BUSINESS",
      payload: {
        ...business,
        fundingRequired: parseFloat(formData.fundingRequired),
        interestRate: parseFloat(formData.interestRate),
        status: formData.status as Business["status"],
      },
    });
    // Add success feedback instead of closing immediately
    alert("Funds updated successfully");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setCropImageUrl(reader.result?.toString() || null);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    // Reset file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropComplete = (croppedUrl: string) => {
    setFormData({ ...formData, photoUrl: croppedUrl });
    dispatch({
      type: "UPDATE_BUSINESS",
      payload: {
        ...business,
        photoUrl: croppedUrl,
      },
    });
    setCropImageUrl(null);
  };

  return (
    <div className="bg-white flex flex-col h-full -mx-3 md:mx-0 px-0 md:px-0 md:rounded-lg animate-fade-in relative font-sans text-[#444444]">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center border-b border-gray-100">
        <button onClick={() => currentView === "menu" ? onBack() : setCurrentView("menu")} className="mr-4 text-[#444444]">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[17px] font-medium tracking-wide">
          {currentView === "menu" && "Profile"}
          {currentView === "funds" && "Funds"}
          {currentView === "profile" && "Profile Details"}
          {currentView === "investors" && "Investors details"}
          {currentView === "bank" && "Bank details"}
          {currentView === "registration" && "Registration Information"}
        </h1>
      </div>

      {currentView === "menu" && (
        <div className="bg-white flex-1">
          <div className="px-5 py-6 flex justify-between items-center border-b border-gray-100">
            <div>
              <h2 className="text-[18px] md:text-[20px] font-normal text-[#444444] mb-1 tracking-wide uppercase">{business.name || "BUSINESS NAME"}</h2>
              <p className="text-[12px] md:text-[13px] text-[#9EA1A6] tracking-widest">{business.ownerName || "Owner Name"}</p>
              <p className="text-[12px] md:text-[13px] text-[#9EA1A6] mt-1">{business.businessId || "ID Number"}</p>
            </div>
            <div className="relative cursor-pointer shrink-0 ml-4" onClick={() => fileInputRef.current?.click()}>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#E8F0FE] text-[#1976D2] flex items-center justify-center overflow-hidden border border-gray-100 relative">
                {business.photoUrl ? (
                  <img src={business.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl md:text-2xl font-normal">{business.name?.substring(0, 2).toUpperCase() || "BU"}</span>
                )}
                
                <div className="absolute bottom-0 w-full h-1/3 bg-black/40 flex items-center justify-center">
                  <Upload className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
          </div>
          
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-[14px] font-medium text-[#444444] mb-3">Account</h3>
            <div className="space-y-0">
              <button onClick={() => setCurrentView("funds")} className="w-full py-3.5 flex justify-between items-center group">
                <span className="text-[14px] md:text-[15px] font-normal text-[#444444]">Funds</span>
                <span className="text-[#444444] font-normal text-[16px]">₹</span>
              </button>
              <div className="h-[1px] w-full bg-gray-50 my-0"></div>
              <button onClick={() => setCurrentView("profile")} className="w-full py-3.5 flex justify-between items-center group">
                <span className="text-[14px] md:text-[15px] font-normal text-[#444444]">Profile</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
              <div className="h-[1px] w-full bg-gray-50 my-0"></div>
              <button onClick={() => setCurrentView("investors")} className="w-full py-3.5 flex justify-between items-center group">
                <span className="text-[14px] md:text-[15px] font-normal text-[#444444]">Investors details</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
              <div className="h-[1px] w-full bg-gray-50 my-0"></div>
              <button onClick={() => setCurrentView("bank")} className="w-full py-3.5 flex justify-between items-center group">
                <span className="text-[14px] md:text-[15px] font-normal text-[#444444]">Bank details</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
              <div className="h-[1px] w-full bg-gray-50 my-0"></div>
              <button onClick={() => setCurrentView("registration")} className="w-full py-3.5 flex justify-between items-center group">
                <span className="text-[14px] md:text-[15px] font-normal text-[#444444]">Registration Information</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === "funds" && (
        <div className="p-4 md:p-6 bg-[#F8F9FA] flex-1">
          <div className="bg-white rounded shadow-sm border border-gray-200 p-5 mb-5 text-center">
            <p className="text-[12px] md:text-[13px] text-[#9EA1A6] font-normal mb-1 flex items-center justify-center gap-1">
              Available balance <Info className="w-3.5 h-3.5 text-[#1976D2]" />
            </p>
            <p className="text-[26px] md:text-[32px] font-normal text-[#1976D2] tracking-wide mb-2">
              {unifiedBalance >= 0 ? "" : "-"}₹{formatINR(Math.abs(unifiedBalance)).replace("₹", "")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="bg-white rounded p-4 border border-gray-200 shadow-sm">
               <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] md:text-[12px] font-normal mb-1 text-[#9EA1A6] uppercase">Funding Required (₹)</label>
                    <input
                      type="number"
                      className="w-full border-b border-gray-300 py-1.5 bg-transparent text-[14px] md:text-[15px] font-normal text-[#444444] focus:border-[#1976D2] outline-none"
                      value={formData.fundingRequired}
                      onChange={(e) => setFormData({...formData, fundingRequired: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] md:text-[12px] font-normal mb-1 text-[#9EA1A6] uppercase">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full border-b border-gray-300 py-1.5 bg-transparent text-[14px] md:text-[15px] font-normal text-[#444444] focus:border-[#1976D2] outline-none"
                      value={formData.interestRate}
                      onChange={(e) => setFormData({...formData, interestRate: e.target.value})}
                    />
                  </div>
                  <button onClick={handleSaveFunds} className="w-full bg-[#4CAF50] text-white py-3 rounded text-[14px] md:text-[15px] font-normal mt-2">
                    + Add funds
                  </button>
               </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded">
            <div className="px-4 py-3 flex justify-between items-center border-b border-gray-100">
              <span className="text-[13px] md:text-[14px] font-normal text-[#444444]">Opening balance</span>
              <span className="text-[13px] md:text-[14px] font-normal text-[#444444]">{formatINR(business.fundingRequired).replace("₹", "")}</span>
            </div>
            <div className="px-4 py-3 flex justify-between items-center border-b border-gray-100">
              <span className="text-[13px] md:text-[14px] font-normal text-[#444444]">Payin</span>
              <span className="text-[13px] md:text-[14px] font-normal text-[#444444]">{formatINR(payin).replace("₹", "")}</span>
            </div>
            <div className="px-4 py-3 flex justify-between items-center border-b border-gray-100">
              <span className="text-[13px] md:text-[14px] font-normal text-[#444444]">Payout</span>
              <span className="text-[13px] md:text-[14px] font-normal text-[#444444]">{formatINR(payout).replace("₹", "")}</span>
            </div>
            <div className="px-4 py-3 flex justify-between items-center border-b border-gray-100">
              <span className="text-[13px] md:text-[14px] font-normal text-[#444444]">Authorities</span>
              <span className="text-[13px] md:text-[14px] font-normal text-[#444444]">{formatINR(authoritiesAssistance).replace("₹", "")}</span>
            </div>
          </div>
        </div>
      )}

      {currentView === "profile" && (
        <div className="p-4 md:p-6 bg-white flex-1 space-y-5">
           <div>
             <label className="block text-[11px] md:text-[12px] font-normal mb-1 text-[#9EA1A6] uppercase">Business Name</label>
             <input
               type="text"
               className="w-full border-b border-gray-300 py-1.5 bg-transparent text-[14px] md:text-[15px] font-normal text-[#444444] focus:border-[#1976D2] outline-none"
               value={formData.name}
               onChange={(e) => setFormData({...formData, name: e.target.value})}
             />
           </div>
           <div>
             <label className="block text-[11px] md:text-[12px] font-normal mb-1 text-[#9EA1A6] uppercase">Description</label>
             <textarea
               className="w-full border-b border-gray-300 py-1.5 bg-transparent text-[14px] md:text-[15px] font-normal text-[#444444] focus:border-[#1976D2] outline-none resize-none h-16"
               value={formData.description}
               onChange={(e) => setFormData({...formData, description: e.target.value})}
             />
           </div>
           <div>
             <label className="block text-[11px] md:text-[12px] font-normal mb-1 text-[#9EA1A6] uppercase">Location</label>
             <input
               type="text"
               className="w-full border-b border-gray-300 py-1.5 bg-transparent text-[14px] md:text-[15px] font-normal text-[#444444] focus:border-[#1976D2] outline-none"
               value={formData.location}
               onChange={(e) => setFormData({...formData, location: e.target.value})}
             />
           </div>
           <div className="pt-4 flex justify-end gap-3">
             <button onClick={() => setCurrentView("menu")} className="px-5 py-2 text-[#444444] border border-gray-300 rounded font-normal text-[14px]">Cancel</button>
             <button onClick={handleSaveProfile} className="px-5 py-2 bg-[#1976D2] text-white rounded font-normal text-[14px]">Save Changes</button>
           </div>
           {onDelete && (
             <div className="pt-8 border-t border-gray-100 mt-8">
               <button onClick={onDelete} className="w-full text-center text-[#FF5722] border border-[#FF5722] hover:bg-[#FF5722]/5 rounded py-3 font-normal text-[14px] transition-colors">
                 Delete Business
               </button>
             </div>
           )}
        </div>
      )}

      {currentView === "investors" && (
        <div className="bg-[#F8F9FA] flex-1">
          <div className="bg-white mb-2 py-4 px-5 border-b border-gray-100 flex justify-between items-center">
             <p className="text-[13px] md:text-[14px] text-[#444444] font-normal">Total funded</p>
             <p className="text-[18px] md:text-[20px] font-normal text-[#444444]">{formatINR(totalFunded).replace("₹", "")}</p>
          </div>
          <div className="bg-white mb-2 py-4 px-5 border-b border-gray-100 flex justify-between items-center">
             <p className="text-[13px] md:text-[14px] text-[#444444] font-normal">Investors</p>
             <p className="text-[18px] md:text-[20px] font-normal text-[#444444]">{activeBusinessInvestments.length}</p>
          </div>
          
          <div className="bg-white pt-2 border-b border-gray-100 mt-4">
             <h3 className="px-5 py-3 text-[14px] font-normal text-[#9EA1A6] border-b border-gray-100 uppercase tracking-wider">Current investor</h3>
             <div className="divide-y divide-gray-100">
               {businessInvestments.map(inv => {
                 const investor = state.investors.find(i => i.id === inv.investorId);
                 return (
                   <div key={inv.id} className="p-4 flex justify-between items-center px-5">
                      <div>
                        <p className="text-[14px] md:text-[15px] font-normal text-[#444444]">{investor?.name || "Unknown"}</p>
                        <p className="text-[12px] md:text-[13px] text-[#9EA1A6] mt-0.5">{inv.timePeriodMonths} Months • <span className={inv.status === "active" ? "text-[#4CAF50]" : "text-[#9EA1A6]"}>{inv.status}</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] md:text-[15px] font-normal text-[#444444]">{formatINR(inv.amount).replace("₹", "")}</p>
                      </div>
                   </div>
                 )
               })}
               {businessInvestments.length === 0 && (
                 <div className="p-6 text-center text-[#9EA1A6] text-[13px] font-normal">
                   No investors found.
                 </div>
               )}
             </div>
          </div>
        </div>
      )}

      {currentView === "bank" && (
        <div className="bg-white flex-1 p-4 md:p-6 space-y-5">
           {business.bankDetails ? (
             <div className="space-y-5">
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-[11px] md:text-[12px] text-[#9EA1A6] uppercase tracking-wide font-normal mb-1">Bank Name</p>
                  <p className="text-[14px] md:text-[15px] font-normal text-[#444444]">{business.bankDetails.bankName}</p>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-[11px] md:text-[12px] text-[#9EA1A6] uppercase tracking-wide font-normal mb-1">Account Number</p>
                  <p className="text-[14px] md:text-[15px] font-normal text-[#444444] font-mono tracking-wider">{business.bankDetails.accountNumber}</p>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-[11px] md:text-[12px] text-[#9EA1A6] uppercase tracking-wide font-normal mb-1">IFSC</p>
                  <p className="text-[14px] md:text-[15px] font-normal text-[#444444] font-mono tracking-wider">{business.bankDetails.ifscCode}</p>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-[11px] md:text-[12px] text-[#9EA1A6] uppercase tracking-wide font-normal mb-1">Account Holder</p>
                  <p className="text-[14px] md:text-[15px] font-normal text-[#444444] uppercase">{business.bankDetails.accountHolderName}</p>
                </div>
             </div>
           ) : (
             <div className="text-center py-10 text-[#9EA1A6] text-[14px] font-normal">
               No bank details recorded.
             </div>
           )}
        </div>
      )}

      {currentView === "registration" && (
        <div className="bg-white flex-1 p-4 md:p-6 space-y-5">
           <div className="border-b border-gray-100 pb-4">
             <p className="text-[11px] md:text-[12px] text-[#9EA1A6] uppercase tracking-wide font-normal mb-1">Date Registered</p>
             <p className="text-[14px] md:text-[15px] font-normal text-[#444444]">{new Date(business.registrationDate).toLocaleDateString("en-IN")}</p>
           </div>
           <div className="border-b border-gray-100 pb-4">
             <p className="text-[11px] md:text-[12px] text-[#9EA1A6] uppercase tracking-wide font-normal mb-1">Commission Paid</p>
             <p className="text-[14px] md:text-[15px] font-normal text-[#444444]">{formatINR(business.registrationCommissionPaid)}</p>
           </div>
           <div className="border-b border-gray-100 pb-4">
             <p className="text-[11px] md:text-[12px] text-[#9EA1A6] uppercase tracking-wide font-normal mb-1">Tax Collected</p>
             <p className="text-[14px] md:text-[15px] font-normal text-[#444444]">{formatINR(business.taxPaid)}</p>
           </div>
           <div className="border-b border-gray-100 pb-4">
             <p className="text-[11px] md:text-[12px] text-[#9EA1A6] uppercase tracking-wide font-normal mb-1">Setup Revenue</p>
             <p className="text-[15px] md:text-[16px] font-normal text-[#1976D2]">{formatINR(business.registrationCommissionPaid + business.taxPaid)}</p>
           </div>
        </div>
      )}

      {cropImageUrl && (
        <ImageCropModal 
          imageUrl={cropImageUrl} 
          onClose={() => setCropImageUrl(null)} 
          onCrop={handleCropComplete} 
        />
      )}
    </div>
  );
}
