import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create super admin if it doesn't exist
  const superAdminEmail = 'superadmin@rapcio.com'
  
  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail }
  })

  if (!existingSuperAdmin) {
    const hashedPassword = await bcrypt.hash('superadmin123', 10)
    
    await prisma.user.create({
      data: {
        fullName: 'Super Administrator',
        email: superAdminEmail,
        password: hashedPassword,
        role: 'SUPER_ADMIN'
      }
    })

    console.log('Super admin created successfully')
  } else {
    console.log('Super admin already exists')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
