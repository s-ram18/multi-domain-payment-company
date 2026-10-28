import { store } from '../utils/store.js';

export function getAuditLogs(req, res) {
  const { category, severity, search } = req.query;
  const logs = store.getAuditLogs({ category, severity, search });
  return res.status(200).json({
    total: logs.length,
    logs
  });
}
