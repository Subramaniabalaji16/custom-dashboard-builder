interface Props {
  status: 'Pending' | 'In progress' | 'Completed';
}

const styles: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  'In progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
};

export default function StatusBadge({ status }: Props) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}
