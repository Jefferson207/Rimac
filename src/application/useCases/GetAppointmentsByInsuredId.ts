import { AppointmentRepository } from '@/domain/repositories/AppointmentRepository';
import { Appointment } from '@/domain/models/Appointment';

export class GetAppointmentsByInsuredId {
  constructor(private readonly repository: AppointmentRepository) {}

  async execute(insuredId: string): Promise<Appointment[]> {
    return await this.repository.findByInsuredId(insuredId);
  }
}
