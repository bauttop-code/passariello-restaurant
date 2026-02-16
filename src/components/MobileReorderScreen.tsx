interface MobileReorderScreenProps {
  user?: { name: string; email: string } | null;
  isLoadingAuth?: boolean;
  onSignInClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
}

export function MobileReorderScreen({
  user,
  isLoadingAuth = false,
  onSignInClick,
  onRegisterClick,
  onLogout,
}: MobileReorderScreenProps) {
  return (
    <div className="min-h-screen bg-white pb-20 pt-6">
      {user ? (
        <div className="px-4 pt-8">
          <div className="text-left mb-8">
            <h2 className="text-2xl text-gray-900 font-bold mb-2">Welcome back, {user.name}!</h2>
            <p className="text-gray-600">Your order history will appear here</p>
          </div>

          <div className="py-12 text-center">
            <p className="text-gray-500">No orders yet</p>
            <p className="text-sm text-gray-400 mt-2">Start ordering to see your history</p>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-3 px-6 bg-white border-2 border-[#A72020] text-[#A72020] rounded-md hover:bg-[#A72020] hover:text-white transition-colors"
          >
            LOG OUT
          </button>
        </div>
      ) : (
        <div className="px-4 pt-12">
          <div className="text-left mb-8">
            <h2 className="text-2xl text-gray-900 font-bold mb-3">Quickly reorder items from your previous orders!</h2>
            <p className="text-gray-600">Login or create an account to start saving your orders for quick reorder.</p>
          </div>

          <div className="flex flex-col gap-3 max-w-sm mx-auto mt-12">
            <button
              onClick={onSignInClick}
              disabled={isLoadingAuth}
              className="w-full py-3.5 px-6 bg-[#A72020] text-white rounded-md hover:bg-[#8a1919] transition-colors disabled:opacity-50 uppercase"
            >
              LOG IN
            </button>
            
            <button
              onClick={onRegisterClick}
              disabled={isLoadingAuth}
              className="w-full py-3.5 px-6 bg-white border-2 border-[#A72020] text-[#A72020] rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 uppercase"
            >
              CREATE ACCOUNT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
