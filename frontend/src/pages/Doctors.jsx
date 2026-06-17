import { useState, useEffect } from 'react';
import api from '../services/api';
import { UserPlus, Star, Phone } from 'lucide-react';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [bookingDoc, setBookingDoc] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await api.get('/doctors');
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  const handleBook = (e, docName) => {
    e.preventDefault();
    alert(`✅ Successfully booked an appointment with ${docName}! You will receive an email confirmation shortly.`);
    setBookingDoc(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Available Specialists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doc => (
          <div key={doc._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-24 h-24 bg-slate-200 rounded-full mb-4 overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=${doc.name}&background=random`} alt={doc.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{doc.name}</h3>
            <p className="text-primary-600 font-medium text-sm mb-2">{doc.specialization}</p>
            <div className="flex items-center text-slate-500 text-sm mb-4">
              <Star size={16} className="text-yellow-400 mr-1" />
              <span>{doc.experience} Years Experience</span>
            </div>
            <button 
              onClick={() => setBookingDoc(doc)}
              className="w-full py-2.5 bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl font-medium transition-colors flex justify-center items-center">
              <Phone size={18} className="mr-2" /> Book Appointment
            </button>
          </div>
        ))}
        {doctors.length === 0 && (
          <div className="col-span-full py-10 text-center text-slate-500 bg-white rounded-2xl border border-slate-100">
            No doctors available right now.
          </div>
        )}
      </div>

      {bookingDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Book Appointment</h3>
            <p className="text-slate-600 mb-6">You are booking a session with <strong>{bookingDoc.name}</strong>.</p>
            <form onSubmit={(e) => handleBook(e, bookingDoc.name)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
                <input type="date" required className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Time</label>
                <input type="time" required className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setBookingDoc(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Doctors;
