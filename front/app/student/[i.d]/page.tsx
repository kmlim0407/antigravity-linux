type Props = {
  params: {
    id: string;
  };
};

export default function StudentDetailPage({ params }: Props) {
  return <div>학생 상세 페이지 (임시) - id: {params.id}</div>;
}
