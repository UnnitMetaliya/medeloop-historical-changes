export interface ChangeLogger {
  logChange(
    collection: string,
    documentId: string,
    fieldName: string,
    oldValue: any,
    newValue: any,
    userId: string,
  ): Promise<void>;
}
