
def find_duplicates(chars):
    count = {}
    for c in chars:
        count[c] = count.get(c, 0) + 1
    return [c for c, freq in count.items() if freq >= 2]

#example
chars = ['c', 'a', 'i', 'o', 'p', 'a', 'o']
print(find_duplicates(chars)) 

