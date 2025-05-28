import { Appointment } from '../models/Appointment';

export interface ISNSPublisher {
  publish(appointment: Appointment): Promise<void>;
}
