import { useCallback, useEffect, useState } from 'react';
import { documentsService } from '../documentsService.js';

export function useDocuments(caseId) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    try { setDocs(await documentsService.listForCase(caseId)); }
    finally { setLoading(false); }
  }, [caseId]);

  useEffect(() => { refresh(); }, [refresh]);

  /** Change status. Pass an optional `reason` string when rejecting. */
  const setStatus = useCallback(async (id, status, reason) => {
    const patch = { status };
    if (reason !== undefined) patch.rejectionReason = reason;
    await documentsService.update(id, patch);
    await refresh();
  }, [refresh]);

  /** Mark received with an optional plain-text filename (legacy path). */
  const receive = useCallback(async (id, fileName) => {
    await documentsService.update(id, { status: 'received', fileName: fileName ?? '' });
    await refresh();
  }, [refresh]);

  const verify = useCallback(async (id) => {
    await documentsService.update(id, { status: 'verified' });
    await refresh();
  }, [refresh]);

  const reject = useCallback(async (id, reason) => {
    await documentsService.update(id, { status: 'rejected', rejectionReason: reason ?? '' });
    await refresh();
  }, [refresh]);

  const create = useCallback(async (data) => {
    await documentsService.create({ caseId, ...data });
    await refresh();
  }, [caseId, refresh]);

  /**
   * Read `file` (a File object) as a DataURL and PATCH the document slot with the
   * binary content, triggering version rotation in the MSW handler.
   * Rejects with an Error if the file exceeds 10 MB.
   */
  const upload = useCallback((id, file, uploadedBy) => {
    return new Promise((resolve, reject_) => {
      if (file.size > 10 * 1024 * 1024) {
        reject_(new Error('File exceeds the 10 MB limit'));
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          await documentsService.update(id, {
            fileData:   e.target.result,
            fileName:   file.name,
            fileSize:   file.size,
            fileType:   file.type,
            uploadedBy: uploadedBy ?? null,
            uploadedAt: new Date().toISOString(),
            status:     'received',
          });
          await refresh();
          resolve();
        } catch (err) {
          reject_(err);
        }
      };
      reader.onerror = () => reject_(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });
  }, [refresh]);

  return { docs, loading, refresh, setStatus, receive, verify, reject, create, upload };
}
