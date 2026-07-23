import { prisma } from './prisma'

export async function requireFormGroupInClass(formGroupId: number, classId: string) {
  const formGroup = await prisma.formGroup.findFirst({
    where: { id: formGroupId, class: classId },
    select: { id: true },
  })

  if (!formGroup) {
    throw createError({ statusCode: 404, statusMessage: 'Form group not found in this class' })
  }

  return formGroup
}

export async function requireFormInClass(formId: number, classId: string) {
  const form = await prisma.form.findFirst({
    where: { id: formId, FormGroup: { class: classId } },
    select: { id: true },
  })

  if (!form) {
    throw createError({ statusCode: 404, statusMessage: 'Form not found in this class' })
  }

  return form
}

export async function requireComponentInClass(componentId: number, classId: string) {
  const component = await prisma.formComponent.findFirst({
    where: { id: componentId, Form: { FormGroup: { class: classId } } },
    select: { id: true },
  })

  if (!component) {
    throw createError({ statusCode: 404, statusMessage: 'Form component not found in this class' })
  }

  return component
}
