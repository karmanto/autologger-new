import React, { useState, useEffect } from "react";
import { getMachineStatusData, getMachineDefData } from "../lib/api";
import { MachineStatusData, MachineDefsData } from "../lib/types";
import { HiCog } from "react-icons/hi";

const MachineStatus: React.FC = () => {
  const [status, setStatus] = useState<MachineStatusData | null>(null);
  const [defs, setDefs] = useState<MachineDefsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!defs) {
          const defData = await getMachineDefData();
          setDefs(defData);
        }

        const statusData = await getMachineStatusData();
        setStatus(statusData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch machine data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    const intervalId = setInterval(fetchData, 2000);

    return () => clearInterval(intervalId);
  }, [defs]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen font-sans">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-sans">
        {error}
      </div>
    );

  if (!status || !defs || !defs.data)
    return (
      <div className="flex justify-center items-center h-screen font-sans">
        No data available.
      </div>
    );

  // Filter hanya mesin dengan status ON di defs
  const activeDefs = defs.data.filter((def) => def.status === "ON");

  const getStatusInfo = (value: number) => {
    switch (value) {
      case 0:
        return {
          text: "OFF",
          color: "text-gray-500",
          bg: "bg-gray-100",
          icon: "text-gray-400",
        };
      case 1:
        return {
          text: "ON",
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          icon: "text-emerald-500",
        };
      case 2:
        return {
          text: "OFFLINE",
          color: "text-red-600",
          bg: "bg-red-50",
          icon: "text-red-500",
        };
      default:
        return {
          text: "UNKNOWN",
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          icon: "text-yellow-500",
        };
    }
  };

  return (
    <div className="container mx-auto p-4 pt-16 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Machine Status Dashboard
      </h1>

      <p className="text-sm text-gray-500 text-center mb-8">
        Last updated: {status.tanggal} {status.waktu}
      </p>

      {activeDefs && activeDefs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {activeDefs.map((machine, index) => {
            const value = status.activeMachine[index] ?? 2; // default OFFLINE jika index tidak ada
            const { text, color, bg, icon } = getStatusInfo(value);

            return (
              <div
                key={machine.name}
                className={`flex items-center justify-between p-4 rounded-xl shadow-sm border ${bg} hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex items-center space-x-3">
                  <HiCog className={`w-7 h-7 ${icon}`} />
                  <div>
                    <p className="text-base font-semibold text-gray-800">
                      {machine.name}
                    </p>
                    <p className={`text-sm ${color}`}>{text}</p>
                    <p className="text-xs text-gray-500">{machine.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          No machine definitions found.
        </div>
      )}
    </div>
  );
};

export default MachineStatus;
