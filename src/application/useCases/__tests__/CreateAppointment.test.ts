import { CreateAppointment } from '../CreateAppointment';
import { AppointmentRepository } from '@/domain/repositories/AppointmentRepository';
import { ISNSPublisher } from '@/application/ports/ISNSPublisher';

describe('CreateAppointment', () => {
  it('debe crear una cita y publicarla en SNS', async () => {
    // Arrange
    const mockRepo: AppointmentRepository = {
      save: jest.fn(),
      findByInsuredId: jest.fn(),
      updateStatus: jest.fn(),
    };

    const mockSNS: ISNSPublisher = {
      publish: jest.fn(),
    };

    const createAppointment = new CreateAppointment(mockRepo, mockSNS);

    const input = {
      insuredId: '001',
      scheduleId: 100,
      countryISO: 'PE',
    };

    // Act
    const result = await createAppointment.execute(input);

    // Assert
    expect(mockRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      insuredId: '001',
      scheduleId: 100,
      status: 'pending',
    }));

    expect(mockSNS.publish).toHaveBeenCalledWith(expect.objectContaining({
      insuredId: '001',
      scheduleId: 100,
      status: 'pending',
    }));

    expect(result).toMatchObject({
      insuredId: '001',
      scheduleId: 100,
      status: 'pending',
    });
  });
});
