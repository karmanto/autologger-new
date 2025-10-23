export interface MachineStatusData {
  tanggal: string;
  waktu: string;
  activeMachine: number[];
}

export interface MachineDefsData {
  data?: {
    name: string;     
    desc: string;     
    status: "ON" | "OFF"; 
  }[];
}

export interface HeaderProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}
