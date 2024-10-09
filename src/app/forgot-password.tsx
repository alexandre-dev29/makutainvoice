import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

export function ForgotPasswordPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Forget password ?</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to get reset code
            </p>
          </div>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Send
            </Button>
            <div className="mt-4 text-center text-sm">
              You remember your password?{' '}
              <Link to={'/auth/login'} className="underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex  items-center justify-center">
        <h2 className="font-bold text-6xl italic text-primary">
          Makuta <span className="text-muted-foreground">Invoice</span>
        </h2>
      </div>
    </div>
  );
}
