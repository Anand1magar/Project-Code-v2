import { Download, FileQuestion } from 'lucide-react';
import Modal from '../../../components/ui/Modal.jsx';
import Button from '../../../components/ui/Button.jsx';

/**
 * @param {{ doc: {fileName:string, fileData:string, fileType:string} | null, onClose: () => void }} props
 */
export default function FilePreviewModal({ doc, onClose }) {
  if (!doc) return null;

  const { fileName, fileData, fileType } = doc;
  const isImage = fileType?.startsWith('image/');
  const isPDF   = fileType === 'application/pdf';

  function handleDownload() {
    const a = document.createElement('a');
    a.href     = fileData;
    a.download = fileName;
    a.click();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={fileName}
      size="lg"
      footer={
        fileData ? (
          <Button size="sm" variant="tertiary" onClick={handleDownload}>
            <Download size={14} strokeWidth={1.5} /> Download
          </Button>
        ) : null
      }
    >
      {isImage && (
        <img
          src={fileData}
          alt={fileName}
          className="max-h-[68vh] w-full object-contain bg-surface-1"
        />
      )}

      {isPDF && (
        <iframe
          src={fileData}
          title={fileName}
          className="w-full border-0 bg-surface-1"
          style={{ height: '68vh' }}
        />
      )}

      {!isImage && !isPDF && (
        <div className="flex flex-col items-center gap-md py-xl text-ink-muted">
          <FileQuestion size={40} strokeWidth={1} />
          <p className="text-body-sm">Preview is not available for this file type.</p>
          {fileData && (
            <Button size="sm" variant="tertiary" onClick={handleDownload}>
              <Download size={14} strokeWidth={1.5} /> Download {fileName}
            </Button>
          )}
        </div>
      )}
    </Modal>
  );
}
