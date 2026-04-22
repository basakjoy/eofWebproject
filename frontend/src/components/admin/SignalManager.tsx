// "use client";


// import  { useState, useEffect, use} from "react";
// import {Plus, Edit2, Trash2, Zap, ArrorwUpRight, ArrowDownLeft, Loader2, X} from "lucide-react"; 
// import { signalService } from "@/services/signalService";
// import { toast } from "sonner";
// import { set } from "react-hook-form";

// export default function SignalManager() {          
//   const [signals, setsignals] = useState<any[]>([]);
//   const [isloading, setisloading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const[ isDeleting, setIsDeleting] = useState<string | null>(null);

//   const [editingId, setEditindId] = useState<string | null>(null);

//   // form state
//    const [ formData, setFormData] = useState({
//     pair: "EUR/USD",
//     type: "Buy",
//     entryPrice:"",
//     takeProfit1:"",
//     takeProfit2:"",
//     takeProfit3:"",
//     stopLoss:"",
//     reliability: "85",
//     timeframe: "1h",
//     analysis: ""
//    });

//    const fetchSignals = async () => {
//     setisloading(true);

//     try {
//       const response = await signalService .getSignals();
//       setsignals(response.data || []);
//     } catch (error) {
//       toast.error("Failed to fetch signals. Please try again.");

//     } finally {
//       setisloading(false);
//     }
// };

// useEffect(()=> {
//   fetchSignals();
// }, []);

// const resetForm = () => {
//   setFormData ({
//     pair: "EUR/USD",
//     type: "Buy",
//     entryPrice:"",
//     takeProfit1:"",
//     takeProfit2:"",
//     takeProfit3:"",
//     stopLoss:"",
//     reliability: "85",
//     timeframe: "1h",
//     analysis: ""

//   });

//   setEditindId(null);
// };

// const handleEdit = ( signal: any ) => {
//    setEditindId(signal.id);
//    setFormData({
//     pair: signal.pair,
//     type: signal.type,
//     entryPrice: signal.entry_price ? signal.entry_price.toString() : signal.entryPrice?.toString()|| "",
//     takeProfit1: signal.take_profit_1 ? signal.take_profit_1.toString() : signal.take_profit_1?. toString() || "", 
//     takeProfit2: signal.take_profit_2 ? signal.take_profit_2.toString() : signal.take_profit_2?. toString() || "",
//     takeProfit3: signal.take_profit_3 ? signal.take_profit_3.toString() : signal.take_profit_3?. toString() || "",
//     stopLoss: signal.stop_loss ? signal.stop_loss.toString() : signal.stop_loss?.toString() || "",
//     reliability: (signal.reliability?(signal.reliability * 100).toString() || "85"),
//     timeframe: signal.timeframe || "1h",
//     analysis: signal.analysis || ""
//    });
// }

// const handleDelete =async (id: string) => {
//   if (!window.confirm("Are you sure you want to delete this signal?"))
//     return;

//   setIsDeleting(id);

//   try {
//     await signalService.deleteSignal(id);
//     toast.success("Signal deleted successfully.");
//     fetchSignals();
//   } catch (error) {
//     toast.error("Failed to delete signal.Please try again")
//   } finally {
//     setIsDeleting(null);
//   }
// };

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setIsSubmitting(true);
  
//   try {
//     const signalData = {
//       pair: formData.pair,
//       type: formData.type,
//       entryPrice: parseFloat (formData.entryPrice),
//       takeProfit1: parseFloat(formData.takeProfit1),
//       takeProfit2: parseFloat(formData.takeProfit2),
//       takeProfit3: parseFloat(formData.takeProfit3),
//       stopLoss: parseFloat(formData.stopLoss),
//       reliability: parseFloat (formData.reliability) / 100,
//       timeframe: formData.timeframe,
//       analysis: formData.analysis
//     };

//     if (editingId) {
//       await signalService.updateSignal(editingId, signalData);
//       toast.success("Signal upadated successfully!");
//     } else {
//       await signalService.createSignal (signalData);
//       toast.success("Trading signal publised successfully;");
//     }

//     resetForm();
//     fetchSignals();
//   }

//   catch (error) {
//     toast.error(editingId? " Failed to upadate signal" : "failed to publish signal");
//   } finally {
//     setIsSubmitting(false);
//   }
// };

// return (
//   <div className="space-y-6">
//     <div className="flex flex-col sm:flex-row sm:items-center justify-between items-start sm:items-start gap-4">
//       <div>
//         <h2 className="text-3xl font-back tracking light text-white">
//         Signal Center
//         </h2>
//        <p className="text -muted-foreground font-medium"> Broadcast premium trading signals</p>
//       </div>
      
//     </div>

//     <div className="grid grid-cols-1 xl:grid-cols-3 gap-60">
//       {/* Create and edit signal from admin panel */}
//        <div className="xl:col-span-1">
//         <div className="glass-card bg-card/40 p-6 sticky top-24">

//         <div className="flex items-center us gap-2 mb-6">
//          <div></div>
//         </div>
//         </div>
//        </div>
//     </div>
//   </div>
// )



// }
