/**
 * Prisma Client 单例
 * 文件路径: scripts/utils/prisma-client.ts
 * 创建时间: 2025-10-05
 * 
 * 开发思路:
 * 1. 创建全局唯一的 Prisma Client 实例
 * 2. 避免在开发环境中创建多个连接
 * 3. 提供类型安全的数据库访问
 * 
 * 设计决策:
 * - 使用单例模式确保只有一个实例
 * - 开发环境使用全局变量避免热重载问题
 * - 生产环境直接创建新实例
 */

import { PrismaClient } from '@prisma/client';

// 声明全局类型
declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * 获取 Prisma Client 实例
 * 
 * 功能说明:
 * - 开发环境: 使用全局变量，避免热重载时创建多个连接
 * - 生产环境: 直接创建新实例
 * 
 * 返回:
 * PrismaClient 实例
 */
export const prisma = global.prisma || new PrismaClient({
  log: ['error', 'warn'],  // 只记录错误和警告
});

// 开发环境保存到全局变量
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
