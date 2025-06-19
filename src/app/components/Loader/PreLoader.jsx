export default function Preloader({ loading }) {
  if (!loading) return null; // Hide spinner if not loading

  return (
    <div
      id="spinner"
      className="w-100 vh-100 bg-white position-fixed translate-middle top-50 start-50 d-flex align-items-center justify-content-center"
      style={{ zIndex: 1050 }} // ensure it overlays everything
    >
      <div className="spinner-grow text-primary" role="status" />
    </div>
  );
}
