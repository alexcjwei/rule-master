import { getObjectURLFromKey } from '@/lib/s3';
import { File } from '@prisma/client';
import { auth } from '@/lib/auth';
import { TriggerEmbedding } from './trigger-embedding';

async function FileRow({ file }: { file: File }) {
  const session = await auth();

  return (
    <tr>
      <th>
        <a href={getObjectURLFromKey(file.key)} target='_blank'>
          {file.name}
        </a>
        {session?.user?.role === 'admin' && (
          <TriggerEmbedding fileId={file.id} />
        )}
      </th>
      <td>{file.createdAt.toLocaleDateString()}</td>
      <td>{file.updatedAt.toLocaleDateString()}</td>
    </tr>
  );
}

export default function FilesTable({ files }: { files: File[] | undefined }) {
  return (
    <div className='overflow-x-auto'>
      <table className='table'>
        {/* head */}
        <thead>
          <tr>
            <th>File name</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {files?.map((file) => (
            <FileRow key={file.id} file={file} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
