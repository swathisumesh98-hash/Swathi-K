/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from "react";
import { CLINICAL_LAB_TESTS, SERVICE_DETAILS } from "../data";
import { Booking, LabTest } from "../types";
import { 
  Search, 
  Check, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Plus, 
  ShoppingBag, 
  X, 
  FileText, 
  CalendarRange, 
  Trash2,
  Syringe,
  Timer
} from "lucide-react";

export function BookingForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<LabTest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Form states
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState<"Male" | "Female" | "Other">("Male");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("07:00 AM - 09:00 AM");
  const [notes, setNotes] = useState("");
  const [bookedSuccess, setBookedSuccess] = useState<boolean>(false);

  const categories = ["All", "General", "Blood", "Cardiac", "Metabolic", "Thyroid", "Liver", "Kidney"];

  // Pre-load historical home bookings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("madiyan_biotech_bookings");
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) {
        console.warn("Could not load local storage bookings: ", e);
      }
    } else {
      // Mock initial seed booking for illustrative beautiful state
      const seedBooking: Booking = {
        id: "MB-8472",
        patientName: "Sumesh Manikoth",
        patientAge: 42,
        patientGender: "Male",
        phone: "+91 95677 84744",
        address: "MK Complex near Madiyan Temple Rd, Manikoth, Kerala",
        preferredDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
        preferredTime: "07:00 AM - 09:00 AM",
        testsSelected: ["Complete Blood Count (CBC)", "Lipid Profile (Cholesterol Panel)"],
        status: "Confirmed",
        totalAmount: 1000,
        notes: "Please call 15 minutes before reaching.",
        createdAt: new Date().toLocaleString()
      };
      setBookings([seedBooking]);
      localStorage.setItem("madiyan_biotech_bookings", JSON.stringify([seedBooking]));
    }
  }, []);

  const saveBookings = (updatedList: Booking[]) => {
    setBookings(updatedList);
    localStorage.setItem("madiyan_biotech_bookings", JSON.stringify(updatedList));
  };

  const handleToggleCart = (test: LabTest) => {
    if (cart.some((item) => item.id === test.id)) {
      setCart((prev) => prev.filter((item) => item.id !== test.id));
    } else {
      setCart((prev) => [...prev, test]);
    }
  };

  const handleRemoveFromCart = (testId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== testId));
  };

  const totalPrice = cart.reduce((acc, curve) => acc + curve.price, 0);

  const handleCheckout = (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Please select at least one biotech lab test to schedule a collection.");
      return;
    }
    if (!patientName || !patientAge || !phone || !address || !preferredDate) {
      alert("Please fill in all clinical required fields.");
      return;
    }

    const newBooking: Booking = {
      id: `MB-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName,
      patientAge: Number(patientAge),
      patientGender,
      phone,
      address,
      preferredDate,
      preferredTime,
      testsSelected: cart.map((item) => item.name),
      status: "Pending",
      totalAmount: totalPrice,
      notes,
      createdAt: new Date().toLocaleString()
    };

    const updated = [newBooking, ...bookings];
    saveBookings(updated);

    // Reset checkout states
    setCart([]);
    setPatientName("");
    setPatientAge("");
    setPhone("");
    setAddress("");
    setNotes("");
    setBookedSuccess(true);

    setTimeout(() => {
      setBookedSuccess(false);
    }, 5000);
  };

  const cancelBooking = (id: string) => {
    const updated = bookings.map((b) => {
      if (b.id === id) {
        return { ...b, status: "Cancelled" as const };
      }
      return b;
    });
    saveBookings(updated);
  };

  const deleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    saveBookings(updated);
  };

  // Filter and search catalog
  const filteredTests = CLINICAL_LAB_TESTS.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          test.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* SECTION 1: Searching Catalog & Selector (Left) */}
      <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Syringe className="w-5 h-5 text-teal-600" /> Clinical Diagnostic Catalog
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Browse our clinical grade biotechnology lab tests. Select tests to initiate a secure Home Sample Collection request.
          </p>
        </div>

        {/* Filters and search box */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests, biomarkers, codes (e.g. lipid, CBC)..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-slate-50/50"
            />
          </div>
          
          <div className="flex gap-1 overflow-x-auto pb-1 max-w-full">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600/10 focus:border-teal-600 text-slate-600 cursor-pointer font-semibold"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : `${cat} Assays`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clinical Catalog Items Grid */}
        <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
          {filteredTests.length > 0 ? (
            filteredTests.map((test) => {
              const isSelected = cart.some((item) => item.id === test.id);
              return (
                <div 
                  key={test.id} 
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isSelected 
                      ? "border-teal-500 bg-teal-50/20 shadow-sm" 
                      : "border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50/80"
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">
                        {test.code}
                      </span>
                      <span className="text-xs font-bold text-teal-600 px-2 py-0.5 bg-teal-100/50 rounded-full font-sans uppercase">
                        {test.category}
                      </span>
                      {test.fastingRequired && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase">
                           10-12 Hr Fasting Required
                        </span>
                      )}
                    </div>
                    
                    <h4 className="text-base font-bold text-slate-900 tracking-tight">{test.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xl">{test.description}</p>
                    
                    {/* Test metadata horizontal stack */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Timer className="w-3.5 h-3.5 text-slate-400" /> ETA: {test.eta}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span>Sample: <strong className="font-semibold text-slate-700">{test.sampleType}</strong></span>
                    </div>
                  </div>

                  {/* Pricing and interaction buttons */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-dashed border-slate-200 pt-3 sm:pt-0 gap-3">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none text-left sm:text-right">Price</div>
                      <div className="text-xl font-bold text-slate-900 mt-1 font-mono">₹{test.price}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleCart(test)}
                      className={`text-xs font-bold tracking-wide rounded-xl px-4 py-2 transition flex items-center gap-1.5 cursor-pointer select-none ${
                        isSelected
                          ? "bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4 text-white" /> Selected
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Select Test
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-3xl">
              <p className="text-sm text-slate-400">No bioscience tests match your query.</p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="text-xs font-bold text-teal-600 hover:underline mt-2 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Cart Checkout and Home Collection Form (Right) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Collection Cart summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-teal-600" /> Home Visit Cart
            </h3>
            <span className="text-xs font-bold font-mono bg-teal-50 text-teal-600 border border-teal-100 rounded-full px-2.5 py-1">
              {cart.length} {cart.length === 1 ? 'Test' : 'Tests'}
            </span>
          </div>

          {cart.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="text-xs font-bold text-slate-800 pr-4 truncate">{item.name}</div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold font-mono text-slate-900">₹{item.price}</span>
                      <button 
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
                        title="Remove test"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary Block */}
              <div className="border-t border-dashed border-slate-200 pt-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-semibold uppercase">Total Assay Cost</div>
                  <div className="text-[10px] text-slate-400 font-semibold">*FREE Home Sample collection in Manikoth/Madiyan Complex context</div>
                </div>
                <div className="text-2xl font-black font-mono text-teal-600">₹{totalPrice}</div>
              </div>

              {/* Collection Form details */}
              <form onSubmit={handleCheckout} className="space-y-4 border-t border-slate-100 pt-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">Patient Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full text-sm pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">Patient Age *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="120"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        placeholder="35"
                        className="w-full text-sm px-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">Gender *</label>
                      <select
                        value={patientGender}
                        onChange={(e: any) => setPatientGender(e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 rounded-xl cursor-pointer"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">Contact Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full text-sm pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">Home Collection Address *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <textarea
                        required
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="MK Complex, Manikoth House, Madiyan, Manikoth P.O, Kerala"
                        className="w-full text-sm pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 rounded-xl leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">Preferred Date *</label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="date"
                          required
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 rounded-xl cursor-pointer"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">Time Slot *</label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
                        <select
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className="w-full text-[11px] pl-7 pr-1.5 py-2 border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 rounded-xl cursor-pointer"
                        >
                          <option value="06:00 AM - 08:00 AM">6 AM - 8 AM (Ideal Fasting)</option>
                          <option value="08:00 AM - 10:00 AM">8 AM - 10 AM (Standard)</option>
                          <option value="10:00 AM - 12:00 PM">10 AM - 12 PM (Late)</option>
                          <option value="02:00 PM - 04:00 PM">2 PM - 4 PM (Afternoon)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">Special Pre-analytical Instructions / Notes</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Patient is diabetic; needs gentle venous draw."
                      className="w-full text-sm px-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 rounded-xl"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl tracking-wide transition shadow-md hover:shadow-lg cursor-pointer"
                >
                  Schedule Free Home Sample Collection
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center p-5 space-y-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200/80">
              <div className="relative rounded-xl overflow-hidden shadow-sm border border-slate-100 max-w-[180px] mx-auto">
                <img 
                  src="/src/assets/images/medical_lab_test_1780132055886.png" 
                  alt="Sterile Lab Samples" 
                  className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-xs text-slate-500 max-w-[220px] mx-auto text-center leading-relaxed">
                Your checkout cart is empty. Please select clinical tests on the left catalog to schedule a certified clinician visit.
              </p>
            </div>
          )}
        </div>

        {/* Live Booking Records Logs */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <CalendarRange className="w-4 h-4 text-teal-600" /> Patient Request History ({bookings.length})
          </h4>

          {bookedSuccess && (
            <div className="bg-teal-50 border border-teal-200 text-teal-800 rounded-2xl p-4 text-xs font-semibold animate-bounce">
              🎉 Request Submitted Successfully! Our clinical team from MK Complex will contact you today. Check your logs below.
            </div>
          )}

          <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
            {bookings.length > 0 ? (
              bookings.map((book) => (
                <div key={book.id} className="border border-slate-100 p-4 rounded-2xl bg-slate-50/40 hover:bg-slate-50 transition space-y-2.5 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-teal-700">{book.id}</span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      book.status === "Pending" ? "bg-amber-100 text-amber-800" :
                      book.status === "Confirmed" ? "bg-cyan-100 text-cyan-800" :
                      book.status === "Completed" ? "bg-teal-100 text-teal-800" :
                      "bg-slate-200 text-slate-600"
                    }`}>
                      {book.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-700">
                    <div className="text-sm font-extrabold">{book.patientName} <span className="text-xs text-slate-400 font-normal">({book.patientAge} yrs, {book.patientGender})</span></div>
                    <div className="text-xs text-slate-500 leading-normal truncate"><MapPin className="w-3.5 h-3.5 inline inline-middle mr-1" /> {book.address}</div>
                    <div className="text-xs text-slate-500 font-bold"><Calendar className="w-3.5 h-3.5 inline inline-middle mr-1" /> {book.preferredDate} | {book.preferredTime}</div>
                  </div>

                  {/* Badges of selected components inside booking log */}
                  <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-100 mt-1">
                    {book.testsSelected.map((testName, i) => (
                      <span key={i} className="text-[9px] font-bold text-slate-600 bg-white border border-slate-100 rounded px-1.5 py-0.5">
                        {testName}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-medium">
                    <span className="font-mono font-bold text-slate-900">Total: ₹{book.totalAmount}</span>

                    <div className="flex items-center gap-1.5">
                      {book.status === "Pending" || book.status === "Confirmed" ? (
                        <button
                          onClick={() => cancelBooking(book.id)}
                          className="text-[10px] font-bold text-amber-700 hover:bg-amber-100 hover:text-amber-900 border border-amber-200 rounded px-2 py-0.5 transition cursor-pointer"
                        >
                          Cancel Appointment
                        </button>
                      ) : null}
                      <button
                        onClick={() => deleteBooking(book.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition cursor-pointer"
                        title="Delete log record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No logged sample collections detected.</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
