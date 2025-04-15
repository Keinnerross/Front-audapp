export const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-4 mb-10 dark:text-gray-400">
    <h2 className="text-xl font-bold">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);
