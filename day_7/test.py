numbers = []
with open("./real_equations.txt", 'r') as f:
    numbers = f.read().strip('\n').split('\n')

def check_equation(result, rest):
    if len(rest) == 1:
        return rest[0] == result

    lastNumber = rest[-1]
    can_multiply = check_equation(result // lastNumber, rest[:-1]) if result % lastNumber == 0 else False
    can_add = check_equation(result - lastNumber, rest[:-1])

    next_power_of_10 = 1
    while next_power_of_10 <= lastNumber:
        next_power_of_10 *= 10

    if (result - lastNumber) % next_power_of_10 == 0:
        can_concat = check_equation((result - lastNumber) // next_power_of_10, rest[:-1])
    else:
        can_concat = False


    return can_multiply or can_add or can_concat

def getNumbers(line):
    result, rest = line.split(': ')
    rest = [int(x) for x in rest.split()]

    return int(result), rest

totalSumOfRightEquations = 0
for line in numbers:
    result, rest = getNumbers(line)
    if check_equation(result, rest):
        totalSumOfRightEquations += result

print(totalSumOfRightEquations)