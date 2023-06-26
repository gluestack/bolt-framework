export interface IMetadata {
    projectName: string;
    containerPath: string;
    sshPort: number | null;
    status: "up" | "down" | "build";
    vmProcessId: number | null;
    mountProcessId: number | null;
    sshProcessIds: (number | null)[] | null;
    projectRunnerId: number | null;
    createdAt: number;
    updatedAt: number;
}
