export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      ev_cars: {
        Row: {
          id: string;
          user_id: string;
          make: string;
          model: string;
          year: number;
          battery_capacity: number;
          current_charge: number;
          purchase_price: number;
          purchase_date: string;
          avg_kwh_per_km: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          make: string;
          model: string;
          year: number;
          battery_capacity: number;
          current_charge?: number;
          purchase_price: number;
          purchase_date: string;
          avg_kwh_per_km?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          make?: string;
          model?: string;
          year?: number;
          battery_capacity?: number;
          current_charge?: number;
          purchase_price?: number;
          purchase_date?: string;
          avg_kwh_per_km?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      energy_usage: {
        Row: {
          id: string;
          car_id: string;
          user_id: string;
          distance_km: number;
          energy_consumed: number;
          cost_saved: number;
          co2_saved: number;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          car_id: string;
          user_id: string;
          distance_km: number;
          energy_consumed: number;
          cost_saved: number;
          co2_saved: number;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          car_id?: string;
          user_id?: string;
          distance_km?: number;
          energy_consumed?: number;
          cost_saved?: number;
          co2_saved?: number;
          recorded_at?: string;
          created_at?: string;
        };
      };
      v2g_transactions: {
        Row: {
          id: string;
          user_id: string;
          car_id: string;
          energy_sold: number;
          price_per_kwh: number;
          total_amount: number;
          transaction_date: string;
          status: string;
          payment_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          car_id: string;
          energy_sold: number;
          price_per_kwh: number;
          total_amount: number;
          transaction_date?: string;
          status?: string;
          payment_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          car_id?: string;
          energy_sold?: number;
          price_per_kwh?: number;
          total_amount?: number;
          transaction_date?: string;
          status?: string;
          payment_id?: string | null;
          created_at?: string;
        };
      };
      energy_prices: {
        Row: {
          id: string;
          location: string;
          price_per_kwh: number;
          timestamp: string;
          demand_level: string;
          created_at: string;
        };
      };
    };
  };
};

export type EVCar = Database['public']['Tables']['ev_cars']['Row'];
export type EnergyUsage = Database['public']['Tables']['energy_usage']['Row'];
export type V2GTransaction = Database['public']['Tables']['v2g_transactions']['Row'];
export type EnergyPrice = Database['public']['Tables']['energy_prices']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
