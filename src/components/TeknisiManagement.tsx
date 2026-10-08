import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wrench,
  Users,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  Star,
  PlusCircle,
  MessageSquare
} from 'lucide-react';

export const TeknisiManagement: React.FC = () => {
  const { teknisiList, tiketList, kirimWhatsAppNotif } = useApp();

  const handleHubungiTeknisi = (phone: string, nama: string) => {
    const text = `Halo Mas ${nama}, ada update tugas perbaikan jaringan RT/RW Net. Mohon cek portal NOC ya.`;
    kirimWhatsAppNotif(phone, nama, 'TIKET_UPDATE', text);
    alert(`Pesan WhatsApp telah dikirimkan ke Teknisi ${nama} (${phone})!`);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Monitoring & Manajemen Teknisi Lapangan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pelacakan status teknisi, penugasan tiket kendala kabel/ODP & integrasi WhatsApp dispatch.
          </p>
        </div>
      </div>

      {/* Technician Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {teknisiList.map((tek) => {
          const activeTasks = tiketList.filter(t => t.assignedTeknisiId === tek.id && t.status !== 'RESOLVED' && t.status !== 'CLOSED');

          return (
            <div key={tek.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{tek.nama}</h3>
                    <div className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{tek.areaTugas}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    tek.status === 'TERSEDIA' ? 'bg-emerald-100 text-emerald-800' :
                    tek.status === 'DI_LOKASI' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tek.status === 'TERSEDIA' ? '● TERSEDIA' :
                     tek.status === 'DI_LOKASI' ? '● DI LOKASI TUGAS' : '● OFFLINE'}
                  </span>
                </div>

                {/* Rating & Tasks */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-400">Tugas Aktif</div>
                    <div className="text-base font-bold text-slate-900">{activeTasks.length} Tiket</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-400">Rating Kinerja</div>
                    <div className="text-base font-bold text-amber-600 flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{tek.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Assigned task details */}
                {activeTasks.length > 0 && (
                  <div className="mt-3 p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs space-y-1">
                    <div className="font-semibold text-sky-900">Tugas Sedang Dikerjakan:</div>
                    {activeTasks.map(t => (
                      <div key={t.id} className="text-sky-800 truncate">
                        • {t.tiketCode}: {t.judul} ({t.pelangganNama})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-600">{tek.phone}</span>
                <button
                  onClick={() => handleHubungiTeknisi(tek.phone, tek.nama)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Kirim WhatsApp</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
