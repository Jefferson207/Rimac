import { UpdateAppointmentStatus } from '@/application/useCases/UpdateAppointmentStatus';
import { AppointmentRepository } from '@/domain/repositories/AppointmentRepository';

describe('UpdateAppointmentStatus', () => {
  it('debe actualizar el estado de una cita a completed', async () => {
    // Mock del repositorio con método updateStatus simulado
    const mockRepo: AppointmentRepository = {
      save: jest.fn(),
      findByInsuredId: jest.fn(),
      updateStatus: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new UpdateAppointmentStatus(mockRepo);

    // Ejecutamos el caso de uso
    await useCase.execute('01234', 100);

    // Verificamos que el método fue llamado con los parámetros correctos
    expect(mockRepo.updateStatus).toHaveBeenCalledWith('01234', 100, 'completed');
  });
});
