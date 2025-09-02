let logs = [];

export const addAuditLog = (log) => {
  logs.push({ ...log, id: Date.now(), timestamp: new Date().toISOString() });
};

export const getAuditLogs = () => logs;
