import { AppointmentRepository } from '@/domain/repositories/AppointmentRepository';

export class UpdateAppointmentStatus {
  constructor(private readonly repository: AppointmentRepository) {}

  async execute(insuredId: string, scheduleId: number): Promise<void> {
    await this.repository.updateStatus(insuredId, scheduleId, 'completed');
  }
}
