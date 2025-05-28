export interface ISNSPublisher {
  publish(data: any): Promise<void>;
}
