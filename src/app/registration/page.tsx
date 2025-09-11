import Image from 'next/image';

export default function RegistrationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Image Registration</h1>
      <div className="flex justify-center">
        <Image
          src="/images/Registration.gif"
          alt="Image Registration Process"
          width={800}
          height={600}
          unoptimized
        />
      </div>
      <p className="text-center mt-4">
        This animation demonstrates our image registration process.
      </p>
    </div>
  );
}
