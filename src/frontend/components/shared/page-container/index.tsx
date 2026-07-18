import './page-container.css'

export type PageContainerProps = {
  name?: string;
  children: React.ReactNode;
};

export default async function PageContainer({ name, children }: PageContainerProps) {

    return (
        <div className="start-container">
            <div className="content-container">
                {children}
            </div>
        </div>
    );
};
